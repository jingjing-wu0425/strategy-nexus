import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

async function callZhipu(messages: Message[], model: string, enableSearch: boolean): Promise<string> {
  const apiKey = process.env.ZHIPU_API_KEY?.trim();
  if (!apiKey) throw new Error('ZHIPU_API_KEY not configured');

  const body: Record<string, unknown> = { model, messages, max_tokens: 500, temperature: 0.7 };

  if (enableSearch) {
    body.tools = [{ type: 'web_search', web_search: { enable: true } }];
  }

  const res = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Zhipu API error: ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, model, enableSearch } = body as {
      messages: Message[];
      model?: string;
      enableSearch?: boolean;
    };

    const activeModel = model ?? process.env.AI_MODEL ?? 'glm-4-flash';
    const response = await callZhipu(messages, activeModel, enableSearch ?? false);

    return NextResponse.json({ response });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
