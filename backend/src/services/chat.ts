import { ChatAnthropic } from "langchain/chat_models/anthropic";
import { BaseMessage, HumanMessage, AIMessage, SystemMessage } from "langchain/schema";
import { ChatOllama } from "langchain/chat_models/ollama";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { Message, ModelConfig } from '../types';
import { AppError } from '../middleware/error';

interface ChatConfig {
  model: string;
  maxTokens?: number;
  temperature?: number;
  provider: "openai" | "anthropic" | "ollama";
  apiKey?: string;
}

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export class ChatService {
  private model: ChatOpenAI | ChatAnthropic | ChatOllama;

  constructor(config: ChatConfig) {
    switch (config.provider) {
      case "openai":
        if (!config.apiKey) {
          throw new AppError(400, 'OpenAI API key is required');
        }
        this.model = new ChatOpenAI({
          openAIApiKey: config.apiKey,
          modelName: config.model,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
        });
        break;

      case "anthropic":
        if (!config.apiKey) {
          throw new AppError(400, 'Anthropic API key is required');
        }
        this.model = new ChatAnthropic({
          anthropicApiKey: config.apiKey,
          modelName: config.model,
          temperature: config.temperature,
        });
        break;

      case "ollama":
        this.model = new ChatOllama({
          model: config.model,
          temperature: config.temperature,
        });
        break;

      default:
        throw new AppError(400, 'Unsupported model provider');
    }
  }

  private convertToLangChainMessages(messages: ChatMessage[]): BaseMessage[] {
    return messages.map(msg => {
      switch (msg.role) {
        case "user":
          return new HumanMessage(msg.content);
        case "assistant":
          return new AIMessage(msg.content);
        case "system":
          return new SystemMessage(msg.content);
      }
    });
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    const langChainMessages = this.convertToLangChainMessages(messages);
    const response = await this.model.invoke(langChainMessages);
    
    // Handle both string and complex content types
    if (typeof response.content === 'string') {
      return response.content;
    } else if (Array.isArray(response.content)) {
      // Join complex content parts into a single string
      return response.content.map(part => 
        typeof part === 'string' ? part : JSON.stringify(part)
      ).join('');
    }
    return '';
  }

  async streamChat(
    messages: ChatMessage[], 
    chatConfig: { model: any; provider: any; apiKey: any; temperature: any; maxTokens: any; }, 
    onChunk: (chunk: any) => void  
  ) {
    const langChainMessages = this.convertToLangChainMessages(messages);
    for await (const chunk of await this.model.stream(langChainMessages)) {
      onChunk(chunk);
    }
  }
}
