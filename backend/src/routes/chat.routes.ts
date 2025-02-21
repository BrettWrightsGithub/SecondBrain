import express, { Request, Response } from 'express';
import { ChatService } from '../services/chat';
import { AppError } from '../middleware/error';
import { OLLAMA_BASE_URL } from '../config/constants';

interface ModelConfig {
  model?: string;
  provider?: {
    type: 'openai' | 'anthropic' | 'ollama';
    apiKey?: string;
    baseUrl?: string;
  };
  temperature?: number;
  maxTokens?: number;
}

interface ChatServiceConfig {
  model: string;
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
}

const router = express.Router();

router.post('/stream', async (req: Request, res: Response) => {
  const { messages, modelConfig }: { messages: any[], modelConfig: ModelConfig } = req.body;
  const messageId = Date.now().toString();
  let currentContent = '';

  try {
    console.log('Received request:', {
      messages,
      modelConfig,
    });

    if (!Array.isArray(messages)) {
      throw new AppError(400, 'Messages must be an array');
    }

    const config: ChatServiceConfig = {
      model: modelConfig?.model || process.env.DEFAULT_MODEL || 'gpt-3.5-turbo',
      provider: modelConfig?.provider?.type || 'openai',
      temperature: modelConfig?.temperature || 0.7,
      maxTokens: modelConfig?.maxTokens || 1000,
    };

    console.log('Using config:', config);

    // Add provider-specific configuration
    if (config.provider === 'openai') {
      config.apiKey = process.env.OPENAI_API_KEY;
    } else if (config.provider === 'anthropic') {
      config.apiKey = process.env.ANTHROPIC_API_KEY;
    } else if (config.provider === 'ollama') {
      config.baseUrl = modelConfig?.provider?.baseUrl || OLLAMA_BASE_URL;
    }

    if (config.provider !== 'ollama' && !config.apiKey) {
      throw new AppError(400, `API key not found for provider ${config.provider}`);
    }

    console.log('Creating chat service with config:', {
      ...config,
      apiKey: config.apiKey ? '[REDACTED]' : undefined
    });

    const chatService = new ChatService(config);

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await chatService.streamChat(messages, (chunk: string) => {
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
  } catch (error) {
    console.error('Chat error:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while generating chat response' });
    }
  }
});

router.post('/', async (req: Request, res: Response) => {
  const { messages, modelConfig }: { messages: any[], modelConfig: ModelConfig } = req.body;

  try {
    if (!Array.isArray(messages)) {
      throw new AppError(400, 'Messages must be an array');
    }

    const config: ChatServiceConfig = {
      model: modelConfig?.model || process.env.DEFAULT_MODEL || 'gpt-3.5-turbo',
      provider: modelConfig?.provider?.type || 'openai',
      temperature: modelConfig?.temperature || 0.7,
      maxTokens: modelConfig?.maxTokens || 1000,
    };

    // Add provider-specific configuration
    if (config.provider === 'openai') {
      config.apiKey = process.env.OPENAI_API_KEY;
    } else if (config.provider === 'anthropic') {
      config.apiKey = process.env.ANTHROPIC_API_KEY;
    } else if (config.provider === 'ollama') {
      config.baseUrl = modelConfig?.provider?.baseUrl || OLLAMA_BASE_URL;
    }

    if (config.provider !== 'ollama' && !config.apiKey) {
      throw new AppError(400, `API key not found for provider ${config.provider}`);
    }

    const chatService = new ChatService(config);
    const response = await chatService.chat(messages);
    res.json({ 
      id: Date.now().toString(),
      content: response,
      done: true 
    });
  } catch (error) {
    console.error('Error:', error);
    if (error instanceof AppError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An error occurred while generating chat response' });
    }
  }
});

export default router;
