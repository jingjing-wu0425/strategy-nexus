'use client';

import { useStrategyStore } from '@/store/useStrategyStore';
import { getMissionById, getPreviousSummaries } from '@/lib/constants/missions';
import { buildLogicScanPrompt, SOCRATIC_SYSTEM_PROMPT } from '@/lib/ai/prompts';

interface Props {
  missionId: string;
  content: string;
  disabled: boolean;
}

export function LogicScanButton({ missionId, content, disabled }: Props) {
  const setAILoading = useStrategyStore((s) => s.setAILoading);
  const addAIResponse = useStrategyStore((s) => s.addAIResponse);
  const isAILoading = useStrategyStore((s) => s.isAILoading);
  const summaries = useStrategyStore((s) => s.missionSummaries);

  const handleScan = async () => {
    const mission = getMissionById(missionId);
    if (!mission || content.length < 50) return;

    const prevSummaries = getPreviousSummaries(missionId, summaries);
    const userPrompt = buildLogicScanPrompt({
      mission,
      userContent: content,
      previousSummaries: prevSummaries,
    });

    setAILoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: SOCRATIC_SYSTEM_PROMPT },
            { role: 'user', content: userPrompt },
          ],
        }),
      });

      if (!res.ok) throw new Error('AI request failed');

      const data = await res.json();
      addAIResponse(missionId, {
        id: `ai-${Date.now()}`,
        missionId,
        question: mission.question,
        rawResponse: data.response,
        timestamp: new Date().toISOString(),
      });
    } catch {
      addAIResponse(missionId, {
        id: `ai-err-${Date.now()}`,
        missionId,
        question: mission.question,
        rawResponse: '⚠ 逻辑扫描暂时不可用，请检查 API 配置后重试。',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setAILoading(false);
    }
  };

  return (
    <button
      onClick={handleScan}
      disabled={disabled || isAILoading}
      className={`text-xs font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
        disabled || isAILoading
          ? 'bg-white/20 text-text-light/40 cursor-not-allowed'
          : 'bg-desert-gold/10 text-desert-gold hover:bg-desert-gold/20'
      }`}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
      {isAILoading ? '扫描中…' : 'Logic Scan'}
    </button>
  );
}
