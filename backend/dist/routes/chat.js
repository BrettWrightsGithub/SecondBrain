"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const error_1 = require("../middleware/error");
const chat_1 = require("../services/chat");
const router = (0, express_1.Router)();
exports.chatRouter = router;
const chatService = new chat_1.ChatService();
const messageSchema = zod_1.z.object({
    content: zod_1.z.string().min(1),
    role: zod_1.z.enum(['user', 'assistant', 'system']),
});
const chatRequestSchema = zod_1.z.object({
    messages: zod_1.z.array(messageSchema),
    modelConfig: zod_1.z.object({
        provider: zod_1.z.object({
            type: zod_1.z.enum(['openai', 'anthropic', 'ollama']),
            apiKey: zod_1.z.string().optional(),
            baseUrl: zod_1.z.string().optional(),
        }),
        model: zod_1.z.string(),
        temperature: zod_1.z.number().min(0).max(2),
        maxTokens: zod_1.z.number().positive(),
        streamResponses: zod_1.z.boolean(),
    }),
});
router.post('/', async (req, res, next) => {
    try {
        const { messages, modelConfig } = chatRequestSchema.parse(req.body);
        if (modelConfig.streamResponses) {
            res.setHeader('Content-Type', 'text/event-stream');
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Connection', 'keep-alive');
            await chatService.streamChat(messages, modelConfig, (chunk) => {
                res.write(`data: ${JSON.stringify(chunk)}\n\n`);
            });
            res.end();
        }
        else {
            const response = await chatService.chat(messages, modelConfig);
            res.json(response);
        }
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            next(new error_1.AppError(400, 'Invalid request data'));
        }
        else {
            next(error);
        }
    }
});
