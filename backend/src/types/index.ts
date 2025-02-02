export interface Message {
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
  temperature: number;
  maxTokens: number;
  provider: {
    type: 'openai' | 'anthropic' | 'ollama';
    apiKey?: string;
    baseUrl?: string;
  };
  streamResponses: boolean;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
}

export interface Document {
  id: string;
  content: string;
  metadata: Record<string, any>;
  embedding?: number[];
}
