'use client';

import { useStrategyStore } from '@/store/useStrategyStore';
import { PHASES } from '@/lib/constants/phases';
import { AIResponsePanel } from '@/components/ai/AIResponsePanel';
import { ExportButtons } from '@/components/export/ExportButtons';

const emptyResponses: never[] = [];

export function TheAside() {
  const activeMissionId = useStrategyStore((s) => s.activeMissionId);
  const responses = useStrategyStore((s) => s.aiResponses[activeMissionId]) ?? emptyResponses;
  const isAILoading = useStrategyStore((s) => s.isAILoading);
  const getPhaseProgress = useStrategyStore((s) => s.getPhaseProgress);

  const renderAIContent = () => {
    if (isAILoading) {
      return (
        <div className="flex items-center gap-2 text-xs text-text-light">
          <div className="w-4 h-4 border-2 border-desert-gold border-t-transparent rounded-full animate-spin" />
          正在分析逻辑...
        </div>
      );
    }

    if (responses.length > 0) {
      return <AIResponsePanel responses={responses} />;
    }

    return (
      <div className="text-center py-16 px-4">
        <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-white/40 flex items-center justify-center">
          <svg className="w-5 h-5 text-text-light/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
          </svg>
        </div>
        <p className="text-xs text-text-light/50 leading-relaxed">
          填写内容后点击 Logic Scan，AI 将审视你的战略逻辑
        </p>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-glass-border">
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-text-light">
          Logic Scan
        </h3>
        <p className="text-[10px] text-text-light/60 mt-1">
          AI 战略逻辑审查
        </p>
      </div>

      {/* AI Responses */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
        {renderAIContent()}
      </div>

      {/* Phase Progress */}
      <div className="border-t border-glass-border px-6 py-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-light mb-3">
          进度总览
        </div>
        <div className="space-y-2">
          {PHASES.map((phase) => {
            const progress = getPhaseProgress(phase.key);
            return (
              <div key={phase.key} className="flex items-center gap-3">
                <span className="text-[10px] text-text-light w-14">{phase.subtitle}</span>
                <div className="flex-1 h-1 bg-white/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: phase.color }}
                  />
                </div>
                <span className="text-[10px] text-text-light w-8 text-right">{progress}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export */}
      <div className="border-t border-glass-border px-6 py-4">
        <ExportButtons />
      </div>
    </div>
  );
}
