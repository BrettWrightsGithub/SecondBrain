import { ChatService } from '../chat';
import { AppError } from '../../middleware/error';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatAnthropic } from 'langchain/chat_models/anthropic';
import { ChatOllama } from 'langchain/chat_models/ollama';

// Mock environment variables
process.env.OLLAMA_URL = 'http://127.0.0.1:11434';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';

jest.mock('langchain/chat_models/openai', () => ({
  ChatOpenAI: jest.fn().mockImplementation((config) => ({
    modelName: 'o3-mini',
    ...config,
  })),
}));

jest.mock('langchain/chat_models/anthropic', () => ({
  ChatAnthropic: jest.fn().mockImplementation((config) => ({
    modelName: 'claude-3-5-sonnet',
    ...config,
  })),
}));

jest.mock('langchain/chat_models/ollama', () => ({
  ChatOllama: jest.fn().mockImplementation((config) => ({
    model: config.model || 'llama3:latest',
    baseUrl: config.baseUrl || 'http://localhost:11434',
  })),
}));

describe('ChatService', () => {
  const validConfig = {
    model: 'gpt-3.5-turbo',
    provider: 'openai' as const,
    apiKey: 'test-key',
    temperature: 0.7,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error when OpenAI API key is missing', () => {
      expect(() => new ChatService({
        ...validConfig,
        apiKey: undefined,
      })).toThrow('OpenAI API key is required');
    });

    it('should throw error when Anthropic API key is missing', () => {
      expect(() => new ChatService({
        ...validConfig,
        provider: 'anthropic' as const,
        apiKey: undefined,
      })).toThrow('Anthropic API key is required');
    });

    it('should create instance with valid OpenAI config', () => {
      expect(() => new ChatService(validConfig)).not.toThrow();
    });

    it('should use default OpenAI model when none provided', () => {
      const service = new ChatService({
        ...validConfig,
        model: 'gpt-3.5-turbo',
        provider: 'openai',
      });
      expect((service as any).model.modelName).toBe('gpt-3.5-turbo');
    });

    it('should use default Anthropic model when none provided', () => {
      const service = new ChatService({
        ...validConfig,
        model: 'claude-3',
        provider: 'anthropic',
        apiKey: 'test-key',
      });
      expect((service as any).model.modelName).toBe('claude-3');
    });
  });

  describe('Ollama model handling', () => {
    it('should use default Ollama model when none provided', () => {
      const service = new ChatService({
        provider: 'ollama',
        model: 'llama3',
        baseUrl: 'http://localhost:11434',
      });
      expect((service as any).model.model).toBe('llama3:latest');
    });

    it('should keep version tag when provided', () => {
      const service = new ChatService({
        provider: 'ollama',
        model: 'llama3:7b',
        baseUrl: 'http://localhost:11434',
      });
      expect((service as any).model.model).toBe('llama3:7b');
    });

    it('should add :latest to known model names', () => {
      const service = new ChatService({
        provider: 'ollama',
        model: 'llama3',
        baseUrl: 'http://localhost:11434',
      });
      expect((service as any).model.model).toBe('llama3:latest');
    });

    it('should default to llama3:latest for unknown models', () => {
      const service = new ChatService({
        provider: 'ollama',
        model: 'unknown-model',
        baseUrl: 'http://localhost:11434',
      });
      expect((service as any).model.model).toBe('llama3:latest');
    });

    it('should use provided baseUrl for Ollama', () => {
      const customUrl = 'http://custom:11434';
      const service = new ChatService({
        provider: 'ollama',
        model: 'llama3',
        baseUrl: customUrl,
      });
      expect((service as any).model.baseUrl).toBe(customUrl);
    });

    it('should use default baseUrl when none provided for Ollama', () => {
      const service = new ChatService({
        provider: 'ollama',
        model: 'llama3',
      });
      expect((service as any).model.baseUrl).toBe('http://127.0.0.1:11434');
    });
  });

  describe('message conversion', () => {
    const service = new ChatService(validConfig);

    it('should convert simple message to chat format', () => {
      const message = 'Hello';
      const result = (service as any).convertMessage(message);
      expect(result).toEqual({
        role: 'user',
        content: 'Hello',
      });
    });

    it('should handle message object with role', () => {
      const message = {
        role: 'assistant',
        content: 'Hello',
      };
      const result = (service as any).convertMessage(message);
      expect(result).toEqual(message);
    });

    it('should handle message object without role', () => {
      const message = {
        content: 'Hello',
      };
      const result = (service as any).convertMessage(message);
      expect(result).toEqual({
        role: 'user',
        content: 'Hello',
      });
    });
  });

  describe('getMessageContent', () => {
    const service = new ChatService(validConfig);

    it('should handle string content', () => {
      const content = 'Hello';
      const result = (service as any).getMessageContent(content);
      expect(result).toBe('Hello');
    });

    it('should handle array content', () => {
      const content = ['Hello', { type: 'text', value: 'World' }];
      const result = (service as any).getMessageContent(content);
      expect(result).toBe('Hello{"type":"text","value":"World"}');
    });

    it('should handle non-string content', () => {
      const content = { type: 'text', value: 'Hello' };
      const result = (service as any).getMessageContent(content);
      expect(result).toBe('[object Object]');
    });
  });

  describe('streamChat', () => {
    const service = new ChatService(validConfig);

    it('should stream chat response', async () => {
      const messages = ['Hello'];
      const onToken = jest.fn();

      // Mock the stream method
      (service as any).model.stream = jest.fn().mockImplementation(async function* () {
        yield { content: 'Hello' };
        yield { content: ' World' };
      });

      await service.streamChat(messages, onToken);

      expect(onToken).toHaveBeenCalledTimes(2);
      expect(onToken).toHaveBeenNthCalledWith(1, 'Hello');
      expect(onToken).toHaveBeenNthCalledWith(2, ' World');
    });

    it('should handle empty chunks', async () => {
      const messages = ['Hello'];
      const onToken = jest.fn();

      // Mock the stream method with some empty chunks
      (service as any).model.stream = jest.fn().mockImplementation(async function* () {
        yield { content: '' };
        yield { content: 'Hello' };
        yield { content: null };
        yield { content: ' World' };
      });

      await service.streamChat(messages, onToken);

      expect(onToken).toHaveBeenCalledTimes(2);
      expect(onToken).toHaveBeenNthCalledWith(1, 'Hello');
      expect(onToken).toHaveBeenNthCalledWith(2, ' World');
    });
  });
});
