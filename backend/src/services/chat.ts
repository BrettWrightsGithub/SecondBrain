import { ChatOpenAI } from 'langchain/chat_models/openai';
import { ChatAnthropic } from 'langchain/chat_models/anthropic';
import { ChatOllama } from 'langchain/chat_models/ollama';
import { HumanMessage, AIMessage, SystemMessage } from 'langchain/schema';
import { AppError } from '../middleware/error';
import { ChatMessage, Message } from '../types/chat';
import { OLLAMA_BASE_URL } from '../config/constants';

const DEFAULT_OLLAMA_MODEL = 'llama3:latest';
const DEFAULT_OPENAI_MODEL = 'o3-mini';
const DEFAULT_ANTHROPIC_MODEL = 'claude-3-5-sonnet';

export class ChatService {
  private model: ChatOpenAI | ChatAnthropic | ChatOllama;

  constructor(config: {
    model: string;
    provider: string;
    apiKey?: string;
    baseUrl?: string;
    temperature?: number;
    maxTokens?: number;
  }) {
    switch (config.provider) {
      case 'openai':
        if (!config.apiKey) {
          throw new AppError(400, 'OpenAI API key is required');
        }
        this.model = new ChatOpenAI({
          openAIApiKey: config.apiKey,
          modelName: config.model || DEFAULT_OPENAI_MODEL,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          streaming: true,
        });
        break;

      case 'anthropic':
        if (!config.apiKey) {
          throw new AppError(400, 'Anthropic API key is required');
        }
        this.model = new ChatAnthropic({
          anthropicApiKey: config.apiKey,
          modelName: config.model || DEFAULT_ANTHROPIC_MODEL,
          temperature: config.temperature,
          streaming: true,
        });
        break;

      case 'ollama':
        // Ensure we use a valid Ollama model name
        const ollamaModel = this.getOllamaModelName(config.model);
        this.model = new ChatOllama({
          baseUrl: config.baseUrl || OLLAMA_BASE_URL,
          model: ollamaModel,
          temperature: config.temperature,
        });
        break;

      default:
        throw new AppError(400, 'Invalid provider');
    }
  }

  private getOllamaModelName(model: string = DEFAULT_OLLAMA_MODEL): string {
    // Strip any version tags and ensure it's a valid Ollama model
    const validOllamaModels = [
      'llama3',
      'llama3.2',
      'llama3.2-vision',
      'phi4',
      'dolphin-phi',
      'deepseek-r1',
      'nemotron-mini',
      'gemma2'
    ];

    // If the model includes a version tag (e.g., 'llama2:latest'), use it as is
    if (model.includes(':')) {
      return model;
    }

    // If it's a known model name, use it with :latest
    const baseName = model.toLowerCase();
    if (validOllamaModels.includes(baseName)) {
      return `${baseName}:latest`;
    }

    // Default to llama2 if the model name isn't recognized
    console.warn(`Unknown Ollama model: ${model}, defaulting to ${DEFAULT_OLLAMA_MODEL}`);
    return DEFAULT_OLLAMA_MODEL;
  }

  private convertToLangChainMessages(messages: ChatMessage[]) {
    return messages.map(msg => {
      switch (msg.role) {
        case 'user':
          return new HumanMessage(msg.content);
        case 'assistant':
          return new AIMessage(msg.content);
        case 'system':
          return new SystemMessage(msg.content);
        default:
          throw new AppError(400, `Invalid message role: ${msg.role}`);
      }
    });
  }

  private getMessageContent(content: any): string {
    if (typeof content === 'string') {
      return content;
    }
    if (Array.isArray(content)) {
      return content.map(part => 
        typeof part === 'string' ? part : JSON.stringify(part)
      ).join('');
    }
    return String(content);
  }

  private convertMessage(message: Message | any): ChatMessage {
    return {
      role: message.role || 'user',
      content: message.content || message,
    };
  }

  async streamChat(messages: (Message | any)[], onToken: (token: string) => void) {
    const chatMessages = messages.map(msg => this.convertMessage(msg));
    const langChainMessages = this.convertToLangChainMessages(chatMessages);
    const stream = await this.model.stream(langChainMessages);

    for await (const chunk of stream) {
      if (chunk.content) {
        onToken(this.getMessageContent(chunk.content));
      }
    }
  }

  async chat(messages: (Message | any)[]): Promise<string> {
    const chatMessages = messages.map(msg => this.convertMessage(msg));
    const langChainMessages = this.convertToLangChainMessages(chatMessages);
    const response = await this.model.call(langChainMessages);
    return this.getMessageContent(response.content);
  }
}
