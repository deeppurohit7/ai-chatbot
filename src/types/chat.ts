export type Role = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export type PersonaType = 'coding-mentor' | 'systems-architect' | 'career-strategist';

export interface Persona {
  id: PersonaType;
  title: string;
  subtitle: string;
  description: string;
  systemPrompt: string;
  badge: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  persona: PersonaType;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  apiKey: string;
  model: string;
  temperature: number;
  persona: PersonaType;
  maxTokens: number;
}
