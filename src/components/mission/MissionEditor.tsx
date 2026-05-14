'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Mission } from '@/types';
import { useStrategyStore } from '@/store/useStrategyStore';
import { LogicScanButton } from '@/components/ai/LogicScanButton';

interface Props {
  mission: Mission;
  phaseColor: string;
}

export function MissionEditor({ mission, phaseColor }: Props) {
  const content = useStrategyStore((s) => s.missionContent[mission.id] ?? '');
  const isComplete = useStrategyStore((s) => s.missionComplete[mission.id]);
  const summary = useStrategyStore((s) => s.missionSummaries[mission.id] ?? '');
  const updateContent = useStrategyStore((s) => s.updateContent);
  const toggleComplete = useStrategyStore((s) => s.toggleComplete);

  const [draft, setDraft] = useState(content);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync draft when mission changes
  useEffect(() => {
    setDraft(content);
  }, [mission.id, content]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const val = e.target.value;
      setDraft(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        updateContent(mission.id, val);
      }, 800);
    },
    [mission.id, updateContent]
  );

  // Auto-resize textarea
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.max(200, el.scrollHeight) + 'px';
    }
  }, [draft]);

  return (
    <div>
      {/* Mission title */}
      <motion.h1
        className="text-3xl font-bold mb-2"
        style={{ fontFamily: 'var(--font-serif)', color: phaseColor }}
      >
        {mission.title}
      </motion.h1>

      {/* Logic tags */}
      <div className="flex gap-2 mb-8">
        {mission.logic_tags.map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/40 text-text-light"
          >
            {tag.replace(/_/g, ' ')}
          </span>
        ))}
      </div>

      {/* Probing question */}
      <div className="mb-8 pl-4 border-l-2" style={{ borderColor: `${phaseColor}30` }}>
        <p className="text-sm text-text-light italic leading-relaxed">
          {mission.question}
        </p>
      </div>

      {/* Editor area */}
      {isComplete ? (
        <div className="relative">
          <div className="p-6 rounded-2xl bg-white/30 border border-glass-border">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-desert-gold mb-3">
              已完成
            </div>
            <p className="text-sm leading-relaxed text-text-main whitespace-pre-wrap">
              {content}
            </p>
            {summary && (
              <div className="mt-4 pt-4 border-t border-glass-border">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-light mb-2">
                  摘要
                </div>
                <p className="text-xs text-text-light leading-relaxed">{summary}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={handleChange}
            placeholder={mission.placeholder}
            className="mission-textarea"
            rows={8}
          />
        </div>
      )}

      {/* Actions bar */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-glass-border">
        <LogicScanButton
          missionId={mission.id}
          content={content}
          disabled={content.length < 50 || isComplete}
        />

        <button
          onClick={() => toggleComplete(mission.id)}
          className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
            isComplete
              ? 'bg-deep-sea text-white'
              : 'bg-white/40 text-text-light hover:bg-white/60'
          }`}
        >
          {isComplete ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </div>
  );
}
