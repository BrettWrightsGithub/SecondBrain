export class ChatService {
  constructor(config: any) {
    // Mock constructor
  }

  async streamChat(messages: any[], onToken: (token: string) => void) {
    // Simulate streaming response
    onToken('Hello');
    onToken(' world');
    onToken('!');
  }

  async chat(messages: any[]) {
    return 'Hello world!';
  }
}
