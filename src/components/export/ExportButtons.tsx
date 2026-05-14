'use client';

import { useState } from 'react';
import { useStrategyStore, type StrategyExportData } from '@/store/useStrategyStore';
import { PHASES } from '@/lib/constants/phases';

function generateMarkdown(data: StrategyExportData): string {
  const lines: string[] = [];

  lines.push(`# ${data.projectName || '营销战略策划书'}`);
  lines.push(`\n> 由 The Strategy Nexus 生成 | ${new Date().toLocaleDateString('zh-CN')}\n`);
  lines.push('---\n');

  for (const phase of PHASES) {
    const phaseMissions = data.missions.filter((m) => m.phase === phase.key);
    lines.push(`## ${phase.subtitle}：${phase.label}\n`);

    for (const m of phaseMissions) {
      lines.push(`### [${m.id}] ${m.title}\n`);
      lines.push(`**探究问题：** ${m.question}\n`);
      if (m.content) {
        lines.push(`${m.content}\n`);
      } else {
        lines.push('*（尚未填写）*\n');
      }
      if (m.summary) {
        lines.push(`> **摘要：** ${m.summary}\n`);
      }
    }
  }

  return lines.join('\n');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const window: any;

function loadPptxGenJS(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PptxGenJS) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/pptxgenjs@4.0.1/dist/pptxgen.bundle.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load PptxGenJS'));
    document.head.appendChild(script);
  });
}

async function generatePPT(data: StrategyExportData): Promise<void> {
  await loadPptxGenJS();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const PptxGenJS = window.PptxGenJS as any;
  const pres = new PptxGenJS();
  pres.layout = 'LAYOUT_16x9';

  const DEEP_SEA = '1B263B';
  const GOLD = 'C2956E';
  const WHITE = 'FFFFFF';
  const LIGHT = '778DA9';

  const getMC = (id: string) => data.missions.find((m) => m.id === id);

  // Slide 1: Cover
  const s1 = pres.addSlide();
  s1.background = { fill: DEEP_SEA };
  s1.addText(data.projectName || '营销战略策划书', {
    x: 1, y: 2.2, w: 8, h: 1.2,
    fontSize: 36, bold: true, color: GOLD, fontFace: 'Noto Sans SC',
  });
  s1.addText('The Strategy Nexus | ' + new Date().toLocaleDateString('zh-CN'), {
    x: 1, y: 3.6, w: 8, h: 0.5,
    fontSize: 12, color: LIGHT, fontFace: 'Noto Sans SC',
  });
  s1.addShape(pres.ShapeType.rect, { x: 1, y: 4.4, w: 2, h: 0.03, fill: { color: GOLD } });

  // Slide 2: Supply
  const s2 = pres.addSlide();
  s2.background = { fill: DEEP_SEA };
  s2.addText('供给侧扫描', { x: 0.8, y: 0.5, w: 8, h: 0.6, fontSize: 28, bold: true, color: GOLD, fontFace: 'Noto Sans SC' });
  s2.addText(
    ['1.1', '1.2', '1.3', '1.4'].map((id) => {
      const m = getMC(id);
      return m ? `[${m.id}] ${m.title}\n${m.summary || (m.content && m.content.slice(0, 150)) || '待定义'}` : '';
    }).join('\n\n'),
    { x: 0.8, y: 1.4, w: 8.4, h: 4, fontSize: 11, color: WHITE, fontFace: 'Noto Sans SC', lineSpacingMultiple: 1.4, valign: 'top' }
  );

  // Slide 3: Demand
  const s3 = pres.addSlide();
  s3.background = { fill: DEEP_SEA };
  s3.addText('需求侧洞察', { x: 0.8, y: 0.5, w: 8, h: 0.6, fontSize: 28, bold: true, color: GOLD, fontFace: 'Noto Sans SC' });
  s3.addText(
    ['2.1', '2.2', '2.3', '2.4', '2.5'].map((id) => {
      const m = getMC(id);
      return m ? `[${m.id}] ${m.title}\n${m.summary || (m.content && m.content.slice(0, 150)) || '待定义'}` : '';
    }).join('\n\n'),
    { x: 0.8, y: 1.4, w: 8.4, h: 4, fontSize: 10, color: WHITE, fontFace: 'Noto Sans SC', lineSpacingMultiple: 1.3, valign: 'top' }
  );

  // Slide 4: Breakthrough i
  const s4 = pres.addSlide();
  s4.background = { fill: DEEP_SEA };
  s4.addText('突破点 i', { x: 0.8, y: 0.5, w: 8, h: 0.6, fontSize: 28, bold: true, color: GOLD, fontFace: 'Noto Sans SC' });
  const iP = getMC('2.5');
  s4.addText((iP && iP.content) || '待定义', { x: 0.8, y: 1.4, w: 8.4, h: 3, fontSize: 14, color: WHITE, fontFace: 'Noto Sans SC', lineSpacingMultiple: 1.6, valign: 'top' });

  // Slide 5: 4P Strategy
  const s5 = pres.addSlide();
  s5.background = { fill: DEEP_SEA };
  s5.addText('4P 策略组合', { x: 0.8, y: 0.5, w: 8, h: 0.6, fontSize: 28, bold: true, color: GOLD, fontFace: 'Noto Sans SC' });
  [{ id: '3.2', label: 'Product' }, { id: '3.3', label: 'Price' }, { id: '3.4', label: 'Place' }, { id: '3.5', label: 'Promotion' }].forEach((item, i) => {
    const m = getMC(item.id);
    const col = i % 2;
    const row = Math.floor(i / 2);
    s5.addText(item.label, { x: 0.8 + col * 4.5, y: 1.3 + row * 2.2, w: 4, h: 0.4, fontSize: 12, bold: true, color: GOLD, fontFace: 'Noto Sans SC' });
    s5.addText((m && (m.summary || (m.content && m.content.slice(0, 200)) || '待定义')) || '待定义', {
      x: 0.8 + col * 4.5, y: 1.8 + row * 2.2, w: 4, h: 1.8,
      fontSize: 9, color: WHITE, fontFace: 'Noto Sans SC', valign: 'top', lineSpacingMultiple: 1.3,
    });
  });

  // Slide 6: KPI
  const s6 = pres.addSlide();
  s6.background = { fill: DEEP_SEA };
  const kpi = getMC('3.6');
  s6.addText('目标与检验指标', { x: 0.8, y: 0.5, w: 8, h: 0.6, fontSize: 28, bold: true, color: GOLD, fontFace: 'Noto Sans SC' });
  s6.addText((kpi && kpi.content) || '待定义', { x: 0.8, y: 1.4, w: 8.4, h: 3, fontSize: 12, color: WHITE, fontFace: 'Noto Sans SC', lineSpacingMultiple: 1.6, valign: 'top' });

  // Slide 7: Action
  const s7 = pres.addSlide();
  s7.background = { fill: DEEP_SEA };
  s7.addText('行动计划', { x: 0.8, y: 0.5, w: 8, h: 0.6, fontSize: 28, bold: true, color: GOLD, fontFace: 'Noto Sans SC' });
  s7.addText(
    ['4.1', '4.2', '4.3'].map((id) => {
      const m = getMC(id);
      return m ? `[${m.id}] ${m.title}\n${m.summary || (m.content && m.content.slice(0, 150)) || '待定义'}` : '';
    }).join('\n\n'),
    { x: 0.8, y: 1.4, w: 8.4, h: 4, fontSize: 11, color: WHITE, fontFace: 'Noto Sans SC', lineSpacingMultiple: 1.4, valign: 'top' }
  );

  pres.writeFile({ fileName: `${data.projectName || 'strategy'}-nexus-deck.pptx` });
}

export function ExportButtons() {
  const exportAllData = useStrategyStore((s) => s.exportAllData);
  const [exporting, setExporting] = useState(false);

  const handleMarkdown = () => {
    const data = exportAllData();
    const md = generateMarkdown(data);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.projectName || 'strategy'}-whitepaper.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePPT = async () => {
    setExporting(true);
    try {
      const data = exportAllData();
      await generatePPT(data);
    } catch (err) {
      console.error('PPT export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleMarkdown}
        className="flex-1 text-[10px] font-bold px-3 py-2 rounded-lg bg-white/30 text-text-light hover:bg-white/50 transition-all uppercase tracking-wider"
      >
        .md
      </button>
      <button
        onClick={handlePPT}
        disabled={exporting}
        className="flex-1 text-[10px] font-bold px-3 py-2 rounded-lg bg-deep-sea text-white hover:bg-deep-sea/90 transition-all uppercase tracking-wider disabled:opacity-50"
      >
        {exporting ? '...' : '.pptx'}
      </button>
    </div>
  );
}
