'use client';

import { motion } from 'framer-motion';
import { useStrategyStore } from '@/store/useStrategyStore';
import { MISSIONS } from '@/lib/constants/missions';
import { PHASES } from '@/lib/constants/phases';

export function TheSpine() {
  const activeMissionId = useStrategyStore((s) => s.activeMissionId);
  const missionComplete = useStrategyStore((s) => s.missionComplete);
  const setActiveMission = useStrategyStore((s) => s.setActiveMission);

  return (
    <nav className="px-6 py-10">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-12">
        <div className="w-8 h-8 bg-deep-sea rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full" />
        </div>
        <span className="font-bold tracking-tighter text-deep-sea text-sm uppercase">
          Nexus Strategy
        </span>
      </div>

      {/* Phase groups */}
      {PHASES.map((phase) => {
        const phaseMissions = MISSIONS.filter((m) => m.phase === phase.key);
        return (
          <div key={phase.key} className="mb-10 last:mb-0">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: phase.color }}
              >
                {phase.subtitle}
              </span>
              <span className="text-xs font-bold text-text-main">
                {phase.label}
              </span>
            </div>

            {/* Vertical line with nodes */}
            <div className="relative ml-4">
              <div
                className="absolute left-[7px] top-0 bottom-0 w-[1px]"
                style={{ backgroundColor: `${phase.color}20` }}
              />
              <div className="space-y-1">
                {phaseMissions.map((mission) => {
                  const isActive = activeMissionId === mission.id;
                  const isComplete = missionComplete[mission.id];
                  return (
                    <button
                      key={mission.id}
                      onClick={() => setActiveMission(mission.id)}
                      className="relative flex items-center gap-3 w-full text-left py-2 px-2 rounded-lg transition-colors hover:bg-white/40 group"
                    >
                      {/* Node indicator */}
                      <div className="relative z-10 w-[15px] h-[15px] flex-shrink-0">
                        {isActive && (
                          <motion.div
                            layoutId="active-ring"
                            className="absolute inset-[-4px] rounded-full"
                            style={{
                              border: `2px solid ${phase.color}`,
                            }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          />
                        )}
                        <div
                          className={`w-full h-full rounded-full transition-colors duration-300 ${
                            isComplete
                              ? 'bg-deep-sea'
                              : isActive
                              ? 'bg-desert-gold'
                              : 'bg-white border-2 border-slate-200'
                          }`}
                        />
                        {isComplete && !isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-[5px] h-[5px] bg-white rounded-full" />
                          </div>
                        )}
                      </div>

                      {/* Label */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] text-text-light font-bold mr-1">
                          {mission.id}
                        </span>
                        <span
                          className={`text-xs transition-colors ${
                            isActive
                              ? 'text-deep-sea font-bold'
                              : 'text-text-light group-hover:text-text-main'
                          }`}
                        >
                          {mission.title}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
