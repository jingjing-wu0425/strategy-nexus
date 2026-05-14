export type Phase = 'Supply' | 'Demand' | 'Strategy' | 'Tactics';

export interface Mission {
  id: string;
  phase: Phase;
  title: string;
  question: string;
  placeholder: string;
  ai_context: string;
  logic_tags: string[];
}

export interface AIResponse {
  id: string;
  missionId: string;
  question: string;
  rawResponse: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
