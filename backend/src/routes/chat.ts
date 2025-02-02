import express from 'express';
import { ChatService } from '../services/chat';
import { Message, ModelConfig } from '../types';
import { AppError } from '../middleware/error';

const router = express.Router();

const chatService = new ChatService({
  model: process.env.DEFAULT_MODEL || 'gpt-3.5-turbo',
  provider: 'openai',
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0.7,
});

router.post('/stream', async (req, res) => {
  try {
    const { messages, modelConfig } = req.body;

    if (!Array.isArray(messages)) {
      throw new AppError(400, 'Messages must be an array');
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const chatConfig = {
      model: modelConfig.model,
      provider: modelConfig.provider.type,
      apiKey: modelConfig.provider.apiKey,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    };

    await chatService.streamChat(
      messages,
      chatConfig,
      (chunk) => {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
    );

    res.end();
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

router.post('/', async (req, res) => {
  try {
    const { messages, modelConfig } = req.body;

    if (!Array.isArray(messages)) {
      throw new AppError(400, 'Messages must be an array');
    }

    const chatConfig = {
      model: modelConfig.model,
      provider: modelConfig.provider.type,
      apiKey: modelConfig.provider.apiKey,
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.maxTokens,
    };

    const response = await chatService.chat(messages);
    res.json({ response });
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;
