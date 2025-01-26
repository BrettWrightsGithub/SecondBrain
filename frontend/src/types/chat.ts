export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
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
