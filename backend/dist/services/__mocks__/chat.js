"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    constructor(config) {
        // Mock constructor
    }
    async streamChat(messages, onToken) {
        // Simulate streaming response
        onToken('Hello');
        onToken(' world');
        onToken('!');
    }
    async chat(messages) {
        return 'Hello world!';
    }
}
exports.ChatService = ChatService;
