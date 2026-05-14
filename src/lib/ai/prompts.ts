import type { Mission } from '@/types';

export const SOCRATIC_SYSTEM_PROMPT = `你是一位麦肯锡级别的商业架构师与战略顾问。

你的唯一任务是：分析用户填写的策略内容，寻找逻辑断裂点。

准则：
1. 绝不给出直接答案或建议。
2. 回顾所有前序任务的结论，寻找前后矛盾。
3. 审视隐含假设，尤其是未经证实的断言。
4. 语气冷峻、专业、直击要害，不用客套。

输出格式：
针对全文提出 3-5 个简短犀利的问题，每个问题不超过 30 字。
用编号列表输出，不要加任何解释。`;

export const CHAT_SYSTEM_PROMPT = `你是一位资深的营销战略顾问。

你的角色是与用户进行深入讨论，帮助他们完善营销策略。

准则：
1. 基于用户在各个任务中填写的内容进行讨论。
2. 可以给出建议、分析利弊、提供行业案例参考。
3. 如果用户提出不合理的主张，温和地指出问题并引导思考。
4. 语气专业但亲和，像一位经验丰富的导师。
5. 回复简洁有力，不超过 300 字。`;

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

请审查以上内容，找出逻辑断裂点，提出 3-5 个简短犀利的问题。`;

  return prompt;
}
