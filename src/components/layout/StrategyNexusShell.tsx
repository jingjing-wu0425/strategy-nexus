'use client';

import { TheSpine } from './TheSpine';
import { TheCanvas } from './TheCanvas';
import { TheAside } from './TheAside';

export function StrategyNexusShell() {
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left: The Spine */}
      <aside className="w-[280px] min-w-[280px] h-full border-r border-glass-border glass overflow-y-auto custom-scrollbar no-scrollbar">
        <TheSpine />
      </aside>

      {/* Center: The Canvas */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
        <TheCanvas />
      </main>

      {/* Right: The Aside */}
      <aside className="w-[380px] min-w-[380px] h-full border-l border-glass-border glass overflow-y-auto custom-scrollbar">
        <TheAside />
      </aside>
    </div>
  );
}
