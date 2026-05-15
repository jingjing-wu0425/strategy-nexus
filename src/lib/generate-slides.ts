import { PHASES } from '@/lib/constants/phases';
import type { StrategyExportData } from '@/store/useStrategyStore';

export function generateHTMLPresentation(data: StrategyExportData): string {
  const projectName = data.projectName || '营销战略策划书';
  const date = new Date().toLocaleDateString('zh-CN');
  const completedMissions = data.missions.filter((m) => m.content);

  const phaseSlides = PHASES.map((phase) => {
    const missions = data.missions.filter((m) => m.phase === phase.key);
    const missionSlides = missions.map((m, i) => buildMissionSlide(m, phase, i, missions.length));
    return [buildPhaseDivider(phase, missions), ...missionSlides];
  }).flat();

  const totalSlides = 2 + phaseSlides.length + 1;

  const slides = [
    buildCoverSlide(projectName, date, totalSlides),
    buildTocSlide(data),
    ...phaseSlides,
    buildClosingSlide(projectName),
  ];

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${projectName} — 营销战略演示</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
:root{
  --deep:#0D1117;--surface:#161B22;--elevated:#21262D;
  --gold:#C2956E;--gold-light:rgba(194,149,110,0.15);--gold-glow:rgba(194,149,110,0.3);
  --steel:#415A77;--mist:#778DA9;--ice:#E0E6ED;
  --text:#F0F6FC;--text-dim:#8B949E;--text-muted:#484F58;
  --phase-supply:#3B82F6;--phase-demand:#F59E0B;--phase-strategy:#8B5CF6;--phase-tactics:#10B981;
  --font-display:'Playfair Display',Georgia,serif;
  --font-body:'Noto Sans SC',system-ui,sans-serif;
}
html{-webkit-text-size-adjust:100%}
body{font-family:var(--font-body);background:var(--deep);color:var(--text);overflow:hidden;height:100vh}
.slide{
  position:absolute;inset:0;height:100vh;height:100dvh;overflow:hidden;
  display:flex;flex-direction:column;justify-content:center;
  opacity:0;visibility:hidden;transition:opacity .6s ease,visibility .6s ease;
  padding:clamp(2rem,5vh,4rem) clamp(2rem,6vw,6rem);
}
.slide.active{opacity:1;visibility:visible}

.reveal{opacity:0;transform:translateY(24px);transition:opacity .5s ease,transform .5s ease}
.slide.active .reveal{opacity:1;transform:translateY(0)}
.slide.active .reveal:nth-child(1){transition-delay:.1s}
.slide.active .reveal:nth-child(2){transition-delay:.2s}
.slide.active .reveal:nth-child(3){transition-delay:.3s}
.slide.active .reveal:nth-child(4){transition-delay:.4s}
.slide.active .reveal:nth-child(5){transition-delay:.5s}
.slide.active .reveal:nth-child(6){transition-delay:.6s}

.progress-bar{position:fixed;bottom:0;left:0;height:3px;background:var(--gold);transition:width .4s ease;z-index:100}

.nav-dots{position:fixed;bottom:clamp(1rem,2vh,1.5rem);left:50%;transform:translateX(-50%);display:flex;gap:6px;z-index:100}
.nav-dot{width:6px;height:6px;border-radius:50%;background:var(--text-muted);cursor:pointer;transition:all .3s}
.nav-dot.active{background:var(--gold);transform:scale(1.4)}
.nav-dot:hover{background:var(--mist)}

.slide-num{position:fixed;bottom:clamp(1rem,2vh,1.5rem);right:clamp(1.5rem,3vw,2.5rem);font-size:clamp(10px,1.2vh,12px);color:var(--text-dim);z-index:100}

h1{font-family:var(--font-display);font-weight:700;font-size:clamp(2rem,5.5vh,4rem);line-height:1.15;letter-spacing:-.02em}
h2{font-family:var(--font-display);font-weight:700;font-size:clamp(1.5rem,3.5vh,2.5rem);line-height:1.2}
h3{font-size:clamp(1rem,2vh,1.3rem);font-weight:700;line-height:1.3}

.badge{display:inline-block;font-size:clamp(9px,1.1vh,11px);font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:clamp(3px,.5vh,6px) clamp(10px,1.2vw,14px);border-radius:100px;margin-bottom:clamp(.5rem,1.5vh,1rem)}
.mission-id{font-size:clamp(10px,1.2vh,12px);font-weight:700;color:var(--text-dim);margin-bottom:clamp(.3rem,.8vh,.6rem);letter-spacing:.05em}
.mission-title{font-size:clamp(1.2rem,2.5vh,1.8rem);font-weight:700;margin-bottom:clamp(.5rem,1.2vh,1rem);line-height:1.3}
.mission-body{font-size:clamp(13px,1.6vh,16px);line-height:1.75;color:var(--ice);max-width:680px;white-space:pre-wrap}
.mission-body:empty::after{content:'（待填写）';color:var(--text-muted);font-style:italic}

.decor-line{width:clamp(40px,5vw,80px);height:2px;border-radius:2px;margin:clamp(.5rem,1.5vh,1rem) 0}

.grid-2{display:grid;grid-template-columns:1fr 1fr;gap:clamp(1rem,2vh,1.5rem)}
.grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(.8rem,1.5vh,1.2rem)}

@media(max-width:700px){
  .grid-2,.grid-3{grid-template-columns:1fr}
  .slide{padding:clamp(1.5rem,4vh,2.5rem) clamp(1.5rem,5vw,3rem)}
}

@media(prefers-reduced-motion:reduce){
  .reveal{opacity:1;transform:none;transition:none}
  .slide{transition:none}
}
</style>
</head>
<body>

${slides.join('\n\n')}

<div class="progress-bar" id="progressBar"></div>
<div class="nav-dots" id="navDots"></div>
<div class="slide-num" id="slideNum"></div>

<script>
const slides=document.querySelectorAll('.slide');
const dots=document.getElementById('navDots');
const bar=document.getElementById('progressBar');
const num=document.getElementById('slideNum');
let cur=0;

slides.forEach((_,i)=>{const d=document.createElement('div');d.className='nav-dot';d.onclick=()=>go(i);dots.appendChild(d)});

function go(n){
  if(n<0||n>=slides.length)return;
  slides[cur].classList.remove('active');
  cur=n;
  slides[cur].classList.add('active');
  dots.querySelectorAll('.nav-dot').forEach((d,i)=>d.classList.toggle('active',i===cur));
  bar.style.width=((cur+1)/slides.length*100)+'%';
  num.textContent=(cur+1)+' / '+slides.length;
}
go(0);

document.addEventListener('keydown',e=>{
  if(e.key==='ArrowRight'||e.key===' '||e.key==='ArrowDown')go(cur+1);
  if(e.key==='ArrowLeft'||e.key==='ArrowUp')go(cur-1);
  if(e.key==='Home')go(0);
  if(e.key==='End')go(slides.length-1);
});

let touchX=0;
document.addEventListener('touchstart',e=>touchX=e.touches[0].clientX);
document.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-touchX;if(Math.abs(d)>50)d<0?go(cur+1):go(cur-1)});
document.addEventListener('wheel',e=>{e.preventDefault();e.deltaY>0?go(cur+1):go(cur-1)},{passive:false});
</script>
</body>
</html>`;
}

function buildCoverSlide(name: string, date: string, total: number) {
  return `<div class="slide" style="background:linear-gradient(135deg,var(--deep) 0%,#1a1f2e 50%,var(--deep) 100%)">
  <div style="position:absolute;top:0;right:0;width:60%;height:100%;background:radial-gradient(ellipse at 70% 50%,var(--gold-light),transparent 70%);pointer-events:none"></div>
  <div style="position:relative;z-index:1">
    <div class="reveal" style="font-size:clamp(10px,1.2vh,12px);color:var(--gold);font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin-bottom:clamp(1rem,3vh,2rem)">The Strategy Nexus</div>
    <h1 class="reveal" style="margin-bottom:clamp(.5rem,1.5vh,1rem)">${escapeHtml(name)}</h1>
    <div class="reveal decor-line" style="background:var(--gold)"></div>
    <div class="reveal" style="font-size:clamp(12px,1.5vh,15px);color:var(--text-dim);margin-top:clamp(.5rem,1.5vh,1rem)">${date} · ${total} 页</div>
  </div>
</div>`;
}

function buildTocSlide(data: StrategyExportData) {
  const items = PHASES.map((p) => {
    const count = data.missions.filter((m) => m.phase === p.key && m.content).length;
    const total = data.missions.filter((m) => m.phase === p.key).length;
    return `<div class="reveal" style="display:flex;align-items:center;gap:clamp(.8rem,1.5vw,1.2rem);padding:clamp(.6rem,1.2vh,1rem) 0;border-bottom:1px solid var(--elevated)">
      <span style="width:8px;height:8px;border-radius:50%;background:${p.color};flex-shrink:0"></span>
      <span style="flex:1;font-size:clamp(14px,1.8vh,17px);font-weight:500">${p.subtitle} ${p.label}</span>
      <span style="font-size:clamp(11px,1.3vh,13px);color:var(--text-dim)">${count}/${total}</span>
    </div>`;
  }).join('\n');

  return `<div class="slide" style="background:var(--deep)">
  <div style="max-width:600px">
    <h2 class="reveal" style="margin-bottom:clamp(1.5rem,3vh,2.5rem)">目录</h2>
    ${items}
  </div>
</div>`;
}

function buildPhaseDivider(phase: (typeof PHASES)[number], missions: StrategyExportData['missions']) {
  const done = missions.filter((m) => m.content).length;
  return `<div class="slide" style="background:linear-gradient(135deg,var(--deep) 0%,${phase.color}15 100%)">
  <div style="position:absolute;top:0;right:0;width:50%;height:100%;background:radial-gradient(ellipse at 80% 50%,${phase.color}12,transparent 70%);pointer-events:none"></div>
  <div style="position:relative;z-index:1">
    <div class="reveal badge" style="background:${phase.color}20;color:${phase.color};border:1px solid ${phase.color}40">${phase.subtitle}</div>
    <h1 class="reveal" style="margin-bottom:clamp(.5rem,1.5vh,1rem)">${phase.label}</h1>
    <div class="reveal decor-line" style="background:${phase.color}"></div>
    <div class="reveal" style="font-size:clamp(12px,1.5vh,15px);color:var(--text-dim);margin-top:clamp(.5rem,1.5vh,1rem)">${done}/${missions.length} 个任务已完成</div>
  </div>
</div>`;
}

function buildMissionSlide(m: StrategyExportData['missions'][0], phase: (typeof PHASES)[number], idx: number, total: number) {
  const hasContent = m.content && m.content.trim();
  const bodyClass = hasContent ? '' : 'empty-body';

  return `<div class="slide" style="background:var(--deep)">
  <div style="max-width:720px">
    <div class="reveal">
      <span class="badge" style="background:${phase.color}20;color:${phase.color};border:1px solid ${phase.color}30">${phase.subtitle} · ${idx + 1}/${total}</span>
    </div>
    <div class="reveal mission-id">${m.id}</div>
    <h3 class="reveal mission-title" style="margin-bottom:clamp(.3rem,.8vh,.6rem)">${escapeHtml(m.title)}</h3>
    <div class="reveal" style="font-size:clamp(11px,1.3vh,13px);color:var(--text-dim);font-style:italic;margin-bottom:clamp(.8rem,2vh,1.5rem);max-width:600px">${escapeHtml(m.question)}</div>
    <div class="reveal decor-line" style="background:${phase.color}"></div>
    <div class="reveal mission-body ${bodyClass}">${hasContent ? escapeHtml(m.content!) : ''}</div>
  </div>
</div>`;
}

function buildClosingSlide(name: string) {
  return `<div class="slide" style="background:linear-gradient(135deg,var(--deep) 0%,#1a1f2e 100%)">
  <div style="position:absolute;bottom:0;left:0;width:100%;height:60%;background:radial-gradient(ellipse at 50% 100%,var(--gold-light),transparent 60%);pointer-events:none"></div>
  <div style="position:relative;z-index:1;text-align:center;width:100%">
    <div class="reveal" style="font-size:clamp(10px,1.2vh,12px);color:var(--gold);font-weight:700;letter-spacing:.15em;text-transform:uppercase;margin-bottom:clamp(1.5rem,4vh,3rem)">The Strategy Nexus</div>
    <h1 class="reveal" style="margin-bottom:clamp(1rem,2vh,1.5rem)">${escapeHtml(name)}</h1>
    <div class="reveal" style="width:60px;height:2px;background:var(--gold);margin:0 auto clamp(1rem,3vh,2rem)"></div>
    <div class="reveal" style="font-size:clamp(14px,1.8vh,17px);color:var(--text-dim)">感谢阅读</div>
  </div>
</div>`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
