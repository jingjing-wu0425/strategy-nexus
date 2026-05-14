'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useStrategyStore } from '@/store/useStrategyStore';
import { getMissionById } from '@/lib/constants/missions';
import { getPhaseMeta } from '@/lib/constants/phases';
import { MissionEditor } from '@/components/mission/MissionEditor';

export function TheCanvas() {
  const activeMissionId = useStrategyStore((s) => s.activeMissionId);
  const mission = getMissionById(activeMissionId);

  if (!mission) {
    return (
      <div className="flex items-center justify-center h-full text-text-light text-sm">
        选择一个任务节点开始
      </div>
    );
  }

  const phaseMeta = getPhaseMeta(mission.phase);

  return (
    <div className="h-full flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-12 py-6 border-b border-glass-border">
        <div className="flex items-center gap-4">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.3em] px-3 py-1 rounded-full"
            style={{ color: phaseMeta.color, backgroundColor: phaseMeta.bgColor }}
          >
            {phaseMeta.label}
          </span>
          <span className="text-xs text-text-light">
            Mission {mission.id}
          </span>
        </div>
      </div>

      {/* Editor area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.35, ease: [0.165, 0.84, 0.44, 1] }}
            className="px-12 py-10 max-w-3xl mx-auto"
          >
            <MissionEditor mission={mission} phaseColor={phaseMeta.color} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
