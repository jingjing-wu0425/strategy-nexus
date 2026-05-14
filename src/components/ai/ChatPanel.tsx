'use client';

import { useState, useRef, useEffect } from 'react';
import { useStrategyStore } from '@/store/useStrategyStore';
import { getMissionById, getPreviousSummaries } from '@/lib/constants/missions';
import { CHAT_SYSTEM_PROMPT, buildLogicScanPrompt } from '@/lib/ai/prompts';
import type { ChatMessage } from '@/types';

interface Props {
  missionId: string;
}

export function ChatPanel({ missionId }: Props) {
  const messages = useStrategyStore((s) => s.chatMessages[missionId] ?? []);
  const isChatLoading = useStrategyStore((s) => s.isChatLoading);
  const addChatMessage = useStrategyStore((s) => s.addChatMessage);
  const setChatLoading = useStrategyStore((s) => s.setChatLoading);
  const content = useStrategyStore((s) => s.missionContent[missionId] ?? '');
  const summaries = useStrategyStore((s) => s.missionSummaries);

  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pb-3">
        {messages.length === 0 && (
          <div className="text-center py-8 px-4">
            <p className="text-xs text-text-light/50">
              输入问题，与 AI 顾问讨论你的策略
            </p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
        {isChatLoading && (
          <div className="flex items-center gap-2 px-3">
            <div className="w-3 h-3 border-2 border-desert-gold border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] text-text-light">思考中...</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-3 border-t border-glass-border">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="输入你的问题..."
          className="flex-1 text-xs px-3 py-2 rounded-lg bg-white/30 border border-glass-border text-text-main placeholder:text-text-light/40 focus:outline-none focus:border-desert-gold/50"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isChatLoading}
          className="px-3 py-2 rounded-lg bg-desert-gold/20 text-desert-gold text-xs font-bold hover:bg-desert-gold/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  const [displayed, setDisplayed] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isUser || hasAnimated.current) {
      setDisplayed(message.content);
      return;
    }
    hasAnimated.current = true;
    setIsTyping(true);
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      if (i < message.content.length) {
        setDisplayed(message.content.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [message.content, isUser]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
          isUser
            ? 'bg-desert-gold/20 text-text-main'
            : 'bg-white/30 border border-glass-border text-text-main'
        }`}
      >
        <p className={`whitespace-pre-wrap ${isTyping ? 'typing-cursor' : ''}`}>
          {displayed}
        </p>
      </div>
    </div>
  );
}
