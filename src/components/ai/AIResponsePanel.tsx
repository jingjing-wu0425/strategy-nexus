'use client';

import { useState, useEffect, useRef } from 'react';
import { useStrategyStore } from '@/store/useStrategyStore';
import { getMissionById, getPreviousSummaries } from '@/lib/constants/missions';
import { CHAT_SYSTEM_PROMPT, buildLogicScanPrompt } from '@/lib/ai/prompts';
import type { AIResponse, ChatMessage } from '@/types';

const emptyChatMessages: ChatMessage[] = [];

interface Props {
  responses: AIResponse[];
  missionId: string;
}

export function AIResponsePanel({ responses, missionId }: Props) {
  return (
    <div className="space-y-4">
      {responses.map((response, idx) => {
        const isLatest = idx === responses.length - 1;
        return (
          <AIResponseCard
            key={response.id}
            response={response}
            missionId={missionId}
            animate={isLatest}
          />
        );
      })}
    </div>
  );
}

function AIResponseCard({ response, missionId, animate }: { response: AIResponse; missionId: string; animate: boolean }) {
  const [displayed, setDisplayed] = useState(animate ? '' : response.rawResponse);
  const [isTyping, setIsTyping] = useState(animate);
  const [chatOpen, setChatOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const removeAIResponse = useStrategyStore((s) => s.removeAIResponse);

  useEffect(() => {
    if (!animate) return;
    let i = 0;
    setDisplayed('');
    setIsTyping(true);
    const interval = setInterval(() => {
      if (i < response.rawResponse.length) {
        setDisplayed(response.rawResponse.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 22);
    return () => clearInterval(interval);
  }, [animate, response.rawResponse]);

  return (
    <div className="rounded-xl bg-white/30 border border-glass-border overflow-hidden">
      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-desert-gold">
            苏格拉底之问
          </div>
          <button
            onClick={() => removeAIResponse(missionId, response.id)}
            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/40 transition-colors text-text-light/40 hover:text-red-400"
            title="删除"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <p className={`text-sm leading-relaxed text-text-main ${isTyping ? 'typing-cursor' : ''}`}>
          {displayed}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-[10px] text-text-light/40">
            {new Date(response.timestamp).toLocaleTimeString('zh-CN')}
          </span>
          <button
            onClick={() => {
              setChatOpen(!chatOpen);
              if (!chatOpen) setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-desert-gold/10 text-desert-gold hover:bg-desert-gold/20 transition-all flex items-center gap-1"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {chatOpen ? '收起' : '对话'}
          </button>
        </div>
      </div>

      {/* Inline Chat */}
      {chatOpen && (
        <InlineChat missionId={missionId} inputRef={inputRef} />
      )}
    </div>
  );
}

export function InlineChat({ missionId, inputRef }: { missionId: string; inputRef: React.RefObject<HTMLInputElement | null> }) {
  const messages = useStrategyStore((s) => s.chatMessages[missionId]) ?? emptyChatMessages;
  const isChatLoading = useStrategyStore((s) => s.isChatLoading);
  const addChatMessage = useStrategyStore((s) => s.addChatMessage);
  const removeChatMessage = useStrategyStore((s) => s.removeChatMessage);
  const setChatLoading = useStrategyStore((s) => s.setChatLoading);
  const content = useStrategyStore((s) => s.missionContent[missionId] ?? '');
  const summaries = useStrategyStore((s) => s.missionSummaries);

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    addChatMessage(missionId, userMsg);
    setInput('');
    setChatLoading(true);

    try {
      const mission = getMissionById(missionId);
      const prevSummaries = getPreviousSummaries(missionId, summaries);
      const contextPrompt = mission
        ? buildLogicScanPrompt({ mission, userContent: content, previousSummaries: prevSummaries })
        : '';

      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enableSearch: true,
          messages: [
            { role: 'system', content: CHAT_SYSTEM_PROMPT + '\n\n## 当前任务上下文\n' + contextPrompt },
            ...chatHistory,
          ],
        }),
      });

      if (!res.ok) throw new Error('Chat request failed');
      const data = await res.json();

      addChatMessage(missionId, {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
      });
    } catch {
      addChatMessage(missionId, {
        id: `a-err-${Date.now()}`,
        role: 'assistant',
        content: '⚠ 对话暂时不可用，请稍后重试。',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setChatLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="border-t border-glass-border bg-white/10">
      {/* Messages */}
      <div ref={scrollRef} className="max-h-48 overflow-y-auto custom-scrollbar px-4 py-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-[10px] text-text-light/40 text-center py-2">
            输入问题，与 AI 顾问讨论
          </p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group`}>
            <div
              className={`max-w-[85%] px-3 py-1.5 rounded-lg text-xs leading-relaxed relative ${
                msg.role === 'user'
                  ? 'bg-desert-gold/20 text-text-main'
                  : 'bg-white/30 border border-glass-border text-text-main'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            <button
              onClick={() => removeChatMessage(missionId, msg.id)}
              className="ml-1 self-center opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded-full hover:bg-white/40 transition-all text-text-light/30 hover:text-red-400 shrink-0"
            >
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex items-center gap-1.5 px-2">
            <div className="w-3 h-3 border-2 border-desert-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-text-light">思考中...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 px-4 py-2 border-t border-glass-border">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="输入你的问题..."
          className="flex-1 text-[11px] px-2.5 py-1.5 rounded-md bg-white/30 border border-glass-border text-text-main placeholder:text-text-light/40 focus:outline-none focus:border-desert-gold/50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isChatLoading}
          className="px-2.5 py-1.5 rounded-md bg-desert-gold/20 text-desert-gold text-[11px] font-bold hover:bg-desert-gold/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
    </div>
  );
}
