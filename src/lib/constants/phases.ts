import type { Phase } from '@/types';

export interface PhaseMeta {
  key: Phase;
  label: string;
  subtitle: string;
  color: string;
  bgColor: string;
}

export const PHASES: PhaseMeta[] = [
  { key: 'Supply',   label: '供给侧扫描', subtitle: 'Phase 1', color: '#1B263B', bgColor: 'rgba(27, 38, 59, 0.06)' },
  { key: 'Demand',   label: '需求侧洞察', subtitle: 'Phase 2', color: '#C2956E', bgColor: 'rgba(194, 149, 110, 0.06)' },
  { key: 'Strategy', label: '战略构筑',   subtitle: 'Phase 3', color: '#415A77', bgColor: 'rgba(65, 90, 119, 0.06)' },
  { key: 'Tactics',  label: '战术落地',   subtitle: 'Phase 4', color: '#778DA9', bgColor: 'rgba(119, 141, 169, 0.06)' },
];

export function getPhaseMeta(phase: Phase): PhaseMeta {
  return PHASES.find(p => p.key === phase)!;
}
