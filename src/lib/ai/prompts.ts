import type { Mission } from '@/types';

export const SOCRATIC_SYSTEM_PROMPT = `你是一位麦肯锡级别的商业架构师与战略顾问。

你的唯一任务是：分析用户填写的策略内容，寻找其中的逻辑断裂点。

准则：
1. 你绝不给出任何直接答案或建议。
2. 你必须回顾用户在之前任务中写下的所有结论，寻找前后矛盾之处。
3. 你必须审视当前内容中的隐含假设——尤其是那些未经证实的断言。
4. 如果用户在 [2.1] 说了高端用户，但在 [3.3] 设了低价，你必须立刻发起挑战。
5. 如果用户在 [1.4] 定义了 USP，但在后续策略中完全没用到这个 USP，你必须指出。
6. 语气：冷峻、专业、苏格拉底式。不用客套，直击要害。

输出格式：
只提出一个能触及问题本质的"灵魂拷问"。不超过 200 字。不要解释为什么问这个问题——问题本身就足够有力。`;

export function buildLogicScanPrompt(params: {
  mission: Mission;
  userContent: string;
  previousSummaries: Array<{ id: string; title: string; summary: string }>;
}): string {
  const { mission, userContent, previousSummaries } = params;

  let prompt = `## 当前任务 [${mission.id}] ${mission.title}

### 探究问题
${mission.question}

### AI 分析上下文
${mission.ai_context}

### 逻辑标签
${mission.logic_tags.join(', ')}

---

## 用户填写内容
${userContent}
`;

  if (previousSummaries.length > 0) {
    prompt += `
---

## 前序任务结论（供逻辑一致性检查）
`;
    for (const s of previousSummaries) {
      prompt += `\n### [${s.id}] ${s.title}\n${s.summary}\n`;
    }
  }

  prompt += `
---

请审查以上内容，找出逻辑断裂点，提出一个灵魂拷问。`;

  return prompt;
}
