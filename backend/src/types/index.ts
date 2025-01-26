export interface Message {
  content: string;
  role: 'user' | 'assistant' | 'system';
}

export interface ModelProvider {
  type: 'openai' | 'anthropic' | 'ollama';
  apiKey?: string;
  baseUrl?: string;
}

export interface ModelConfig {
  provider: ModelProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  streamResponses: boolean;
}

export interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}
