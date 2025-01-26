import { Router } from 'express';
import { z } from 'zod';
import { AppError } from '../middleware/error';
import { ChatService } from '../services/chat';

const router = Router();
const chatService = new ChatService();

const messageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
});

const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  modelConfig: z.object({
    provider: z.object({
      type: z.enum(['openai', 'anthropic', 'ollama']),
      apiKey: z.string().optional(),
      baseUrl: z.string().optional(),
    }),
    model: z.string(),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().positive(),
    streamResponses: z.boolean(),
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
    } else {
      const response = await chatService.chat(messages, modelConfig);
      res.json(response);
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      next(new AppError(400, 'Invalid request data'));
    } else {
      next(error);
    }
  }
});

export { router as chatRouter };
