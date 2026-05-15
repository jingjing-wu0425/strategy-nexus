import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callZhipu(messages: Message[], model: string): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY?.trim();
  if (!apiKey) throw new Error('ZHIPU_API_KEY not configured');

  const res = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages, max_tokens: 8000, temperature: 0.6 }),
  });

  if (!res.ok) throw new Error(`Zhipu API error: ${await res.text()}`);
  return (await res.json()).choices[0].message.content;
}

const SYSTEM_PROMPT = `你是一位顶级商业演示文稿设计师。你的任务是将营销策划内容转化为一个精美的 HTML 演示文稿。

核心原则：
1. 精简：每页幻灯片最多 4-6 个要点，每个要点不超过 30 字。原文几千字的内容必须提炼为精华。
2. 可视化：数据、对比、流程等必须用图表展示（用 Plotly.js 的 scatter/bar/pie 类型）。
3. 结构：按阶段分组，每阶段一个封面页 + 内容页，不要把所有内容堆在一页。

输出要求：
- 返回一个完整的、自包含的 HTML 文件
- 深色主题（#0D1117 背景），金色 (#C2956E) 和白色文字
- 使用 CSS 变量管理颜色
- 每页 .slide 必须是 100vh，overflow:hidden
- 使用 clamp() 做响应式字体
- 支持键盘左右箭头翻页
- 包含进度条和页码
- 动画：页面切换时内容依次淡入（CSS transition + opacity/transform）

Plotly 图表要求：
- 在 HTML 中通过 <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script> 引入 Plotly
- 为每个需要图表的页面创建一个 <div id="chart-N"> 并在 <script> 中用 Plotly.newPlot() 渲染
- 图表配色：主色 #C2956E（金色），辅色 #415A77（钢蓝），背景透明
- 图表标题和轴标签用中文

页面结构模板：
1. 封面页：项目名 + 日期
2. 目录页：四个阶段概览
3. Phase 1 封面 → 供给侧关键发现（1-2页）
4. Phase 2 封面 → 需求侧洞察 + 突破点 i（1-2页）
5. Phase 3 封面 → 4P 策略组合（用卡片或四象限展示）+ 目标指标
6. Phase 4 封面 → 行动计划时间线
7. 结束页：核心定位语

重要：
- 不要照搬原文！提炼、概括、可视化
- 如果原文有数据（市场份额、价格、百分比），必须画图
- 如果原文有对比，用表格或并列卡片
- 如果原文有流程，用箭头/步骤展示
- 每页内容密度要低，宁可多分几页也不要挤`;

export async function POST(req: NextRequest) {
  try {
    const { content } = (await req.json()) as { content: string };
    const model = process.env.AI_MODEL ?? 'glm-4-flash';

    const messages: Message[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `以下是完整的营销策划内容，请将其转化为一个精美的 HTML 演示文稿：\n\n${content}` },
    ];

    let html = await callZhipu(messages, model);

    // Extract HTML from markdown code blocks if the AI wrapped it
    const htmlMatch = html.match(/```html\s*\n([\s\S]*?)```/);
    if (htmlMatch) html = htmlMatch[1];

    // Ensure it starts with <!DOCTYPE or <html
    if (!html.trim().startsWith('<!DOCTYPE') && !html.trim().startsWith('<html')) {
      const start = html.indexOf('<!DOCTYPE') !== -1 ? html.indexOf('<!DOCTYPE') : html.indexOf('<html');
      if (start !== -1) html = html.slice(start);
    }

    return NextResponse.json({ html });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
