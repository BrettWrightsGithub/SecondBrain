export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  sender: string;
  timestamp: Date;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ModelProvider {
  type: 'openai' | 'anthropic' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
}

export interface ModelConfig {
  model: string;
  provider: ModelProvider;
  temperature?: number;
  maxTokens?: number;
}
