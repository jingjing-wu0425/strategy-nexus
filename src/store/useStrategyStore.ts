import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Phase, AIResponse } from '@/types';
import { MISSIONS } from '@/lib/constants/missions';

interface StrategyStore {
  activeMissionId: string;
  missionContent: Record<string, string>;
  missionSummaries: Record<string, string>;
  missionComplete: Record<string, boolean>;
  aiResponses: Record<string, AIResponse[]>;
  isAILoading: boolean;
  projectName: string;

  setActiveMission: (id: string) => void;
  updateContent: (id: string, text: string) => void;
  setSummary: (id: string, summary: string) => void;
  toggleComplete: (id: string) => void;
  addAIResponse: (id: string, response: AIResponse) => void;
  setAILoading: (v: boolean) => void;
  setProjectName: (name: string) => void;
  getPhaseProgress: (phase: Phase) => number;
  exportAllData: () => StrategyExportData;
  resetAll: () => void;
}

export interface StrategyExportData {
  projectName: string;
  missions: Array<{
    id: string;
    phase: Phase;
    title: string;
    question: string;
    content: string;
    summary: string;
    isComplete: boolean;
    aiResponses: AIResponse[];
  }>;
}

export const useStrategyStore = create<StrategyStore>()(
  persist(
    (set, get) => ({
      activeMissionId: '1.1',
      missionContent: {},
      missionSummaries: {},
      missionComplete: {},
      aiResponses: {},
      isAILoading: false,
      projectName: '',

      setActiveMission: (id) => set({ activeMissionId: id }),

      updateContent: (id, text) =>
        set((s) => ({ missionContent: { ...s.missionContent, [id]: text } })),

      setSummary: (id, summary) =>
        set((s) => ({ missionSummaries: { ...s.missionSummaries, [id]: summary } })),

      toggleComplete: (id) =>
        set((s) => {
          const next = !s.missionComplete[id];
          const summary = next
            ? s.missionContent[id]?.slice(0, 200) ?? ''
            : s.missionSummaries[id] ?? '';
          return {
            missionComplete: { ...s.missionComplete, [id]: next },
            missionSummaries: { ...s.missionSummaries, [id]: summary },
          };
        }),

      addAIResponse: (id, response) =>
        set((s) => ({
          aiResponses: {
            ...s.aiResponses,
            [id]: [...(s.aiResponses[id] ?? []), response],
          },
        })),

      setAILoading: (v) => set({ isAILoading: v }),
      setProjectName: (name) => set({ projectName: name }),

      getPhaseProgress: (phase) => {
        const state = get();
        const phaseMissions = MISSIONS.filter((m) => m.phase === phase);
        const completed = phaseMissions.filter(
          (m) => state.missionComplete[m.id]
        ).length;
        return Math.round((completed / phaseMissions.length) * 100);
      },

      exportAllData: () => {
        const s = get();
        return {
          projectName: s.projectName,
          missions: MISSIONS.map((m) => ({
            id: m.id,
            phase: m.phase,
            title: m.title,
            question: m.question,
            content: s.missionContent[m.id] ?? '',
            summary: s.missionSummaries[m.id] ?? '',
            isComplete: s.missionComplete[m.id] ?? false,
            aiResponses: s.aiResponses[m.id] ?? [],
          })),
        };
      },

      resetAll: () =>
        set({
          activeMissionId: '1.1',
          missionContent: {},
          missionSummaries: {},
          missionComplete: {},
          aiResponses: {},
          isAILoading: false,
          projectName: '',
        }),
    }),
    {
      name: 'strategy-nexus-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeMissionId: state.activeMissionId,
        missionContent: state.missionContent,
        missionSummaries: state.missionSummaries,
        missionComplete: state.missionComplete,
        aiResponses: state.aiResponses,
        projectName: state.projectName,
      }),
    }
  )
);
