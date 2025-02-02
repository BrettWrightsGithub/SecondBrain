"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const openai_1 = require("langchain/llms/openai");
const anthropic_1 = require("langchain/chat_models/anthropic");
const ollama_1 = require("langchain/chat_models/ollama");
const schema_1 = require("langchain/schema");
const error_1 = require("../middleware/error");
class ChatService {
    constructor(config) {
        switch (config.provider) {
            case 'openai':
                if (!config.apiKey) {
                    throw new error_1.AppError(400, 'OpenAI API key is required');
                }
                this.model = new openai_1.OpenAI({
                    openAIApiKey: config.apiKey,
                    modelName: config.model,
                    temperature: config.temperature,
                    maxTokens: config.maxTokens,
                });
                break;
            case 'anthropic':
                if (!config.apiKey) {
                    throw new error_1.AppError(400, 'Anthropic API key is required');
                }
                this.model = new anthropic_1.ChatAnthropic({
                    anthropicApiKey: config.apiKey,
                    modelName: config.model,
                    temperature: config.temperature,
                    maxTokens: config.maxTokens,
                });
                break;
            case 'ollama':
                this.model = new ollama_1.ChatOllama({
                    model: config.model,
                    temperature: config.temperature,
                });
                break;
            default:
                throw new error_1.AppError(400, 'Unsupported model provider');
        }
    }
    convertToLangChainMessages(messages) {
        return messages.map(msg => {
            switch (msg.role) {
                case "user":
                    return new schema_1.HumanMessage(msg.content);
                case "assistant":
                    return new schema_1.AIMessage(msg.content);
                case "system":
                    return new schema_1.SystemMessage(msg.content);
            }
        });
    }
    async chat(messages) {
        const langChainMessages = this.convertToLangChainMessages(messages);
        const response = await this.model.call(langChainMessages);
        return response.content;
    }
    async streamChat(messages, config, onChunk) {
        const model = this.model;
        const stream = await model.stream(messages.map(msg => ({ role: msg.role, content: msg.content })));
        for await (const chunk of stream) {
            onChunk(chunk);
        }
    }
}
exports.ChatService = ChatService;
