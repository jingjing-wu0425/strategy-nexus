import type { Mission, Phase } from '@/types';

export const MISSIONS: Mission[] = [
  // ── Phase 1: Supply ──
  {
    id: '1.1',
    phase: 'Supply',
    title: '行业现状与大趋势',
    question: '你所处的行业正在经历怎样的结构性变化？未来 3–5 年，哪些力量会重新定义竞争规则？',
    placeholder: '从市场规模、增速、技术渗透率、政策环境等维度，描述你所看到的宏观图景…',
    ai_context: 'Industry macro trends and structural shifts. This establishes the playing field for all subsequent analysis.',
    logic_tags: ['trend', 'macro', 'industry'],
  },
  {
    id: '1.2',
    phase: 'Supply',
    title: '核心竞品优劣势拆解',
    question: '如果用户只能选一个竞品而不选你，最可能的原因是什么？你的对手最怕你做什么？',
    placeholder: '列出 3–5 个核心竞品，分别从产品力、渠道、品牌、价格、用户口碑等维度做深度拆解…',
    ai_context: 'Competitive landscape deep-dive. Identify what competitors take for granted — those blind spots are opportunities.',
    logic_tags: ['competitor', 'weakness', 'opportunity'],
  },
  {
    id: '1.3',
    phase: 'Supply',
    title: '品牌形象与可调动资源',
    question: '如果品牌是一个人，你最不希望别人说你像谁？你手上有哪些别人拿不走的牌？',
    placeholder: '盘点品牌资产（认知度、信任度、调性）、核心能力（技术、供应链、团队）、以及可调动的渠道与合作伙伴资源…',
    ai_context: 'Self-audit of brand equity and deployable resources. The goal is to find asymmetries between what we have and what competitors lack.',
    logic_tags: ['brand', 'resource', 'capability'],
  },
  {
    id: '1.4',
    phase: 'Supply',
    title: '核心卖点与差异化形象',
    question: '用一句话说清楚：为什么用户选你而不是任何其他选项？这句话经得起反驳吗？',
    placeholder: '综合前三步的分析，提炼出你的 USP（Unique Selling Proposition）。确保它不是一句广告语，而是一个战略判断…',
    ai_context: 'Synthesis of supply-side analysis into a single USP. This must logically flow from 1.1–1.3; if it doesn\'t, the analysis has gaps.',
    logic_tags: ['USP', 'differentiation', 'positioning'],
  },

  // ── Phase 2: Demand ──
  {
    id: '2.1',
    phase: 'Demand',
    title: '目标用户群体画像',
    question: '你的用户在做购买决策的那一刻，内心真正害怕失去的是什么？',
    placeholder: '不仅描述人口统计特征（年龄、收入、地域），更要刻画心理特征——价值观、焦虑源、身份认同、社交圈层…',
    ai_context: 'User persona construction beyond demographics. Focus on psychographics: fears, aspirations, identity, and decision triggers.',
    logic_tags: ['persona', 'psychographic', 'segment'],
  },
  {
    id: '2.2',
    phase: 'Demand',
    title: '场景下的显性与隐性需求',
    question: '用户嘴上说的需求和他们凌晨两点还在搜索的东西，是同一件事吗？',
    placeholder: '按场景（使用场景、购买场景、推荐场景）列出显性需求（用户能说出来的）和隐性需求（用户未必意识到但驱动行为的）…',
    ai_context: 'Demand mapping across usage scenarios. Explicit needs are what competitors already address; implicit needs are where blue ocean lies.',
    logic_tags: ['scenario', 'explicit_need', 'implicit_need'],
  },
  {
    id: '2.3',
    phase: 'Demand',
    title: '未满足需求与根因分析',
    question: '为什么这些需求至今没有被很好地满足？是能力问题、意愿问题，还是认知问题？',
    placeholder: '对每个未满足的需求，深挖根因——是产品功能缺失？价格门槛？渠道触达不到？还是用户根本不知道自己需要？…',
    ai_context: 'Root cause analysis of unmet needs. Categorize gaps as product/price/channel/communication to map onto later 4P strategy.',
    logic_tags: ['pain_point', 'root_cause', 'gap'],
  },
  {
    id: '2.4',
    phase: 'Demand',
    title: '痛点优先级排序',
    question: '如果资源只够解决一个痛点，你会选哪个？为什么不是其他的？',
    placeholder: '综合群体规模（影响面）、解决难度（可行性）、GMV 潜力（商业价值）三个维度，对痛点做矩阵排序…',
    ai_context: 'Prioritization matrix for pain points. Must balance reach (how many users), feasibility (can we solve it), and impact (GMV potential).',
    logic_tags: ['priority', 'matrix', 'trade_off'],
  },
  {
    id: '2.5',
    phase: 'Demand',
    title: '锁定增长突破点 i',
    question: '这个突破点 i 为什么是"杠杆"而不是"工作量"？撬动它，会带来什么连锁反应？',
    placeholder: '基于排序结果，锁定那个对增长最关键的突破点 i。说明为什么聚焦于此能产生非线性回报，而不是线性努力…',
    ai_context: 'The i-point: the single leverage point where focused effort produces disproportionate returns. Must connect back to USP from 1.4.',
    logic_tags: ['i_point', 'leverage', 'breakthrough'],
  },

  // ── Phase 3: Strategy ──
  {
    id: '3.1',
    phase: 'Strategy',
    title: '品牌定位语',
    question: '如果你的定位语换一个竞品名字也成立，那它就毫无意义。你的定位能通过这个测试吗？',
    placeholder: '基于突破点 i 和 USP，给出最终的品牌定位语。它应该是一句判断，而不是一句口号——要让人一听就知道"这就是你，不是别人"…',
    ai_context: 'Brand positioning statement. Must be uniquely ownable — if a competitor could say the same thing, it fails.',
    logic_tags: ['positioning', 'brand_statement', 'uniqueness'],
  },
  {
    id: '3.2',
    phase: 'Strategy',
    title: '产品调整策略',
    question: '你的产品需要做减法还是加法？用户真正愿意付费的功能有哪些？',
    placeholder: '针对品牌定位，说明产品线需要哪些调整——砍掉什么、强化什么、新增什么。确保每一项调整都直接服务于突破点 i…',
    ai_context: 'Product strategy aligned with positioning. Every feature decision must trace back to the i-point, not to competitor parity.',
    logic_tags: ['product', 'feature', 'alignment'],
  },
  {
    id: '3.3',
    phase: 'Strategy',
    title: '定价逻辑',
    question: '你的定价传递的是"性价比"还是"身份认同"？它和定位语说的是同一件事吗？',
    placeholder: '说明定价策略——锚定价格、实际价格、促销逻辑。解释为什么这个价格区间能支撑你的定位，而不是与定位产生矛盾…',
    ai_context: 'Pricing strategy that must be consistent with positioning. High-end positioning with low prices (or vice versa) is a logic gap.',
    logic_tags: ['pricing', 'anchor', 'consistency'],
  },
  {
    id: '3.4',
    phase: 'Strategy',
    title: '渠道布局',
    question: '你的用户在哪里花时间，你的渠道就该在哪里。你的渠道选择是基于习惯还是基于便利？',
    placeholder: '列出触达目标用户的核心渠道——线上（社交媒体、内容平台、电商平台）和线下（门店、活动、合作伙伴）。说明每个渠道的角色（认知/转化/复购）…',
    ai_context: 'Channel strategy mapped to user behavior. Channels must match where target personas actually spend time and make decisions.',
    logic_tags: ['channel', 'distribution', 'touchpoint'],
  },
  {
    id: '3.5',
    phase: 'Strategy',
    title: '传播核心信息与内容策略',
    question: '如果用户只能记住你的一句话，你希望是哪句？你打算怎么让他们记住？',
    placeholder: '定义传播的核心信息（一句话）和内容策略——内容形式（图文/视频/直播）、内容节奏、内容调性、核心叙事框架…',
    ai_context: 'Communication and content strategy. The core message must distill positioning into something memorable and repeatable.',
    logic_tags: ['communication', 'content', 'message'],
  },
  {
    id: '3.6',
    phase: 'Strategy',
    title: '预期目标与检验指标',
    question: '如果三个月后这个策略没有起效，你最早会在哪个指标上看到信号？',
    placeholder: '制定阶段性目标（短期 3 个月、中期 6 个月、长期 12 个月）和对应的检验指标——GMV、CAC、LTV、NPS、市场份额等…',
    ai_context: 'KPI framework that enables early detection of strategy failure. Leading indicators matter more than lagging ones.',
    logic_tags: ['KPI', 'target', 'measurement'],
  },

  // ── Phase 4: Tactics ──
  {
    id: '4.1',
    phase: 'Tactics',
    title: '营销活动主题与核心目标',
    question: '这次活动的目标是一个具体的行为（购买/注册/分享），还是一个模糊的感觉（曝光/认知）？前者才是可执行的。',
    placeholder: '定义营销活动的主题、核心目标（可量化的行为指标）、时间节点、以及与品牌定位的关联…',
    ai_context: 'Campaign planning with concrete behavioral objectives. Vague "awareness" goals are a red flag.',
    logic_tags: ['campaign', 'objective', 'behavioral'],
  },
  {
    id: '4.2',
    phase: 'Tactics',
    title: '活动诱饵与用户参与链路',
    question: '用户凭什么放下手头的事来参与你的活动？这个诱饵和最终的转化之间有几步？每一步都在流失多少人？',
    placeholder: '设计具体的活动"诱饵"——是什么让用户无法拒绝？画出完整的用户参与链路（从看到活动到完成转化），标注每一步的预期转化率…',
    ai_context: 'Campaign hook and user journey design. The bait must be irresistible and the funnel must be minimal — each step is a leak point.',
    logic_tags: ['hook', 'funnel', 'conversion'],
  },
  {
    id: '4.3',
    phase: 'Tactics',
    title: '执行风险评估与复盘机制',
    question: '如果最坏的情况发生，你的 Plan B 是什么？谁来在什么时候触发它？',
    placeholder: '列出执行中的主要风险（预算超支、效果不达预期、竞品反击、舆情危机等），制定应对预案。设计复盘节奏——什么时候看什么数据，谁来拍板调整…',
    ai_context: 'Risk management and review mechanism. Strategy without contingency is gambling; every assumption needs a kill-switch metric.',
    logic_tags: ['risk', 'contingency', 'review'],
  },
];

export function getMissionsByPhase(phase: Phase): Mission[] {
  return MISSIONS.filter(m => m.phase === phase);
}

export function getMissionById(id: string): Mission | undefined {
  return MISSIONS.find(m => m.id === id);
}

export function getPreviousMissions(currentId: string): Mission[] {
  const idx = MISSIONS.findIndex(m => m.id === currentId);
  if (idx <= 0) return [];
  return MISSIONS.slice(0, idx);
}

export function getPreviousSummaries(
  currentId: string,
  summaries: Record<string, string>
): Array<{ id: string; title: string; summary: string }> {
  return getPreviousMissions(currentId)
    .map(m => ({ id: m.id, title: m.title, summary: summaries[m.id] ?? '' }))
    .filter(s => s.summary.length > 0);
}
