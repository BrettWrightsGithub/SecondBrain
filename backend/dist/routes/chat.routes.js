"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_1 = require("../services/chat");
const error_1 = require("../middleware/error");
const constants_1 = require("../config/constants");
const router = express_1.default.Router();
router.post('/stream', async (req, res) => {
    const { messages, modelConfig } = req.body;
    const messageId = Date.now().toString();
    let currentContent = '';
    try {
        console.log('Received request:', {
            messages,
            modelConfig,
        });
        if (!Array.isArray(messages)) {
            throw new error_1.AppError(400, 'Messages must be an array');
        }
        const config = {
            model: modelConfig?.model || process.env.DEFAULT_MODEL || 'gpt-3.5-turbo',
            provider: modelConfig?.provider?.type || 'openai',
            temperature: modelConfig?.temperature || 0.7,
            maxTokens: modelConfig?.maxTokens || 1000,
        };
        console.log('Using config:', config);
        // Add provider-specific configuration
        if (config.provider === 'openai') {
            config.apiKey = process.env.OPENAI_API_KEY;
        }
        else if (config.provider === 'anthropic') {
            config.apiKey = process.env.ANTHROPIC_API_KEY;
        }
        else if (config.provider === 'ollama') {
            config.baseUrl = modelConfig?.provider?.baseUrl || constants_1.OLLAMA_BASE_URL;
        }
        if (config.provider !== 'ollama' && !config.apiKey) {
            throw new error_1.AppError(400, `API key not found for provider ${config.provider}`);
        }
        console.log('Creating chat service with config:', {
            ...config,
            apiKey: config.apiKey ? '[REDACTED]' : undefined
        });
        const chatService = new chat_1.ChatService(config);
        // Set up SSE headers
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        await chatService.streamChat(messages, (chunk) => {
            currentContent += chunk;
            res.write(`data: ${JSON.stringify({
                id: messageId,
                content: currentContent,
                done: false,
            })}\n\n`);
        });
        // Send final message after streaming is complete
        res.write(`data: ${JSON.stringify({
            id: messageId,
            content: currentContent,
            done: true,
        })}\n\n`);
        res.end();
    }
    catch (error) {
        console.error('Chat error:', error);
        if (error instanceof error_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An error occurred while generating chat response' });
        }
    }
});
router.post('/', async (req, res) => {
    const { messages, modelConfig } = req.body;
    try {
        if (!Array.isArray(messages)) {
            throw new error_1.AppError(400, 'Messages must be an array');
        }
        const config = {
            model: modelConfig?.model || process.env.DEFAULT_MODEL || 'gpt-3.5-turbo',
            provider: modelConfig?.provider?.type || 'openai',
            temperature: modelConfig?.temperature || 0.7,
            maxTokens: modelConfig?.maxTokens || 1000,
        };
        // Add provider-specific configuration
        if (config.provider === 'openai') {
            config.apiKey = process.env.OPENAI_API_KEY;
        }
        else if (config.provider === 'anthropic') {
            config.apiKey = process.env.ANTHROPIC_API_KEY;
        }
        else if (config.provider === 'ollama') {
            config.baseUrl = modelConfig?.provider?.baseUrl || constants_1.OLLAMA_BASE_URL;
        }
        if (config.provider !== 'ollama' && !config.apiKey) {
            throw new error_1.AppError(400, `API key not found for provider ${config.provider}`);
        }
        const chatService = new chat_1.ChatService(config);
        const response = await chatService.chat(messages);
        res.json({
            id: Date.now().toString(),
            content: response,
            done: true
        });
    }
    catch (error) {
        console.error('Error:', error);
        if (error instanceof error_1.AppError) {
            res.status(error.statusCode).json({ error: error.message });
        }
        else {
            res.status(500).json({ error: 'An error occurred while generating chat response' });
        }
    }
});
exports.default = router;
