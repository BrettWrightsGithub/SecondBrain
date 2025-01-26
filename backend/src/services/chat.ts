import { OpenAI } from 'langchain/llms/openai';
import { ChatAnthropic } from 'langchain/chat_models/anthropic';
import { Message, ModelConfig } from '../types';
import { AppError } from '../middleware/error';

export class ChatService {
  private async getModel(config: ModelConfig) {
    switch (config.provider.type) {
      case 'openai':
        if (!config.provider.apiKey) {
          throw new AppError(400, 'OpenAI API key is required');
        }
        return new OpenAI({
          openAIApiKey: config.provider.apiKey,
          modelName: config.model,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          streaming: config.streamResponses,
        });

      case 'anthropic':
        if (!config.provider.apiKey) {
          throw new AppError(400, 'Anthropic API key is required');
        }
        return new ChatAnthropic({
          anthropicApiKey: config.provider.apiKey,
          modelName: config.model,
          temperature: config.temperature,
          maxTokens: config.maxTokens,
          streaming: config.streamResponses,
        });

      case 'ollama':
        // TODO: Implement Ollama chat model
        throw new AppError(501, 'Ollama support coming soon');

      default:
        throw new AppError(400, 'Unsupported model provider');
    }
  }

  async chat(messages: Message[], config: ModelConfig) {
    const model = await this.getModel(config);
    const response = await model.call(
      messages.map(msg => ({ role: msg.role, content: msg.content }))
    );
    return response;
  }

  async streamChat(
    messages: Message[],
    config: ModelConfig,
    onChunk: (chunk: any) => void
  ) {
    const model = await this.getModel({ ...config, streamResponses: true });
    const stream = await model.stream(
      messages.map(msg => ({ role: msg.role, content: msg.content }))
    );

    for await (const chunk of stream) {
      onChunk(chunk);
    }
  }
}
