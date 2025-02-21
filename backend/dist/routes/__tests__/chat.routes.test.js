"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const chat_1 = require("../../services/chat");
jest.mock('../../services/chat', () => {
    return {
        ChatService: jest.fn(),
    };
});
// Mock environment variables
process.env.HOST = 'localhost';
process.env.PORT = '3001';
process.env.OLLAMA_URL = 'http://127.0.0.1:11434';
// Create a test app
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/chat', require('../chat.routes').default);
describe('Chat Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        process.env.OPENAI_API_KEY = 'test-key';
    });
    afterEach(() => {
        delete process.env.OPENAI_API_KEY;
    });
    describe('POST /api/chat/stream', () => {
        it('should handle streaming chat with OpenAI configuration', async () => {
            const mockStream = async function* () {
                yield { content: 'Hello' };
                yield { content: ' World' };
            };
            const mockStreamChat = jest.fn().mockImplementation((messages, onToken) => {
                return new Promise((resolve) => {
                    const stream = mockStream();
                    (async () => {
                        for await (const chunk of stream) {
                            onToken(chunk.content);
                        }
                        resolve();
                    })();
                });
            });
            chat_1.ChatService.mockImplementation(() => ({
                streamChat: mockStreamChat,
            }));
            const response = await (0, supertest_1.default)(app)
                .post('/api/chat/stream')
                .send({
                messages: [{ role: 'user', content: 'Hello' }],
                modelConfig: {
                    model: 'gpt-4',
                    provider: { type: 'openai' },
                },
            });
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toBe('text/event-stream');
            expect(mockStreamChat).toHaveBeenCalled();
        });
        it('should handle invalid messages format', async () => {
            const response = await (0, supertest_1.default)(app)
                .post('/api/chat/stream')
                .send({
                messages: 'not an array',
                modelConfig: {
                    model: 'gpt-4',
                    provider: { type: 'openai' },
                },
            });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Messages must be an array');
        });
        it('should handle streaming chat with Ollama configuration', async () => {
            const mockStreamChat = jest.fn();
            mockStreamChat.mockImplementationOnce(async function* () {
                yield 'Hello';
                yield ' world';
            });
            chat_1.ChatService.mockImplementation(() => ({
                streamChat: mockStreamChat,
            }));
            const response = await (0, supertest_1.default)(app)
                .post('/api/chat/stream')
                .send({
                messages: [{ role: 'user', content: 'Hello' }],
                modelConfig: {
                    model: 'llama3',
                    provider: { type: 'ollama', baseUrl: 'http://localhost:11434' }
                }
            });
            expect(response.status).toBe(200);
            expect(response.headers['content-type']).toBe('text/event-stream');
        });
        it('should require API key for non-Ollama providers', async () => {
            process.env.OPENAI_API_KEY = '';
            const response = await (0, supertest_1.default)(app)
                .post('/api/chat/stream')
                .send({
                messages: [{ role: 'user', content: 'Hello' }],
                modelConfig: {
                    model: 'gpt-4',
                    provider: {
                        type: 'openai'
                    }
                }
            });
            expect(response.status).toBe(400);
            expect(response.body.error).toBe('API key not found for provider openai');
        });
    });
});
