'use client';

import { useState, useEffect } from 'react';
import type { AIResponse } from '@/types';

interface Props {
  responses: AIResponse[];
}

export function AIResponsePanel({ responses }: Props) {
  return (
    <div className="space-y-4">
      {responses.map((response, idx) => {
        const isLatest = idx === responses.length - 1;
        return (
          <AIResponseCard
            key={response.id}
            response={response}
            animate={isLatest}
          />
        );
      })}
    </div>
  );
}

function AIResponseCard({ response, animate }: { response: AIResponse; animate: boolean }) {
  const [displayed, setDisplayed] = useState(animate ? '' : response.rawResponse);
  const [isTyping, setIsTyping] = useState(animate);

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
    <div className="p-4 rounded-xl bg-white/30 border border-glass-border">
      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-desert-gold mb-3">
        苏格拉底之问
      </div>
      <p className={`text-sm leading-relaxed text-text-main ${isTyping ? 'typing-cursor' : ''}`}>
        {displayed}
      </p>
      <div className="mt-3 text-[10px] text-text-light/40">
        {new Date(response.timestamp).toLocaleTimeString('zh-CN')}
      </div>
    </div>
  );
}
