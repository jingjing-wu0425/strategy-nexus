'use client';

import { useState, useRef, useCallback } from 'react';
import { TheSpine } from './TheSpine';
import { TheCanvas } from './TheCanvas';
import { TheAside } from './TheAside';

export function StrategyNexusShell() {
  const [leftW, setLeftW] = useState(280);
  const [rightW, setRightW] = useState(380);
  const dragging = useRef<'left' | 'right' | null>(null);
  const startX = useRef(0);
  const startW = useRef(0);

  const onMouseDown = useCallback((side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = side;
    startX.current = e.clientX;
    startW.current = side === 'left' ? leftW : rightW;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = ev.clientX - startX.current;
      if (dragging.current === 'left') {
        setLeftW(Math.max(200, Math.min(500, startW.current + delta)));
      } else {
        setRightW(Math.max(280, Math.min(600, startW.current - delta)));
      }
    };

    const onMouseUp = () => {
      dragging.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }, [leftW, rightW]);

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left: The Spine */}
      <aside style={{ width: leftW, minWidth: leftW }} className="h-full border-r border-glass-border glass overflow-y-auto custom-scrollbar no-scrollbar">
        <TheSpine />
      </aside>

      {/* Left resizer */}
      <div
        onMouseDown={(e) => onMouseDown('left', e)}
        className="w-1.5 cursor-col-resize hover:bg-desert-gold/20 active:bg-desert-gold/30 transition-colors shrink-0"
      />

      {/* Center: The Canvas */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
        <TheCanvas />
      </main>

      {/* Right resizer */}
      <div
        onMouseDown={(e) => onMouseDown('right', e)}
        className="w-1.5 cursor-col-resize hover:bg-desert-gold/20 active:bg-desert-gold/30 transition-colors shrink-0"
      />

      {/* Right: The Aside */}
      <aside style={{ width: rightW, minWidth: rightW }} className="h-full border-l border-glass-border glass overflow-y-auto custom-scrollbar">
        <TheAside />
      </aside>
    </div>
  );
}
