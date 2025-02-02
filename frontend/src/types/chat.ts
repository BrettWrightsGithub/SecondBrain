export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  sender: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: Message;
  logs?: Array<{
    timestamp: Date;
    message: string;
    type: 'info' | 'debug' | 'error';
  }>;
}

export interface ChatNotification {
  timestamp: Date;
  message: string;
  type: 'info' | 'error';
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
