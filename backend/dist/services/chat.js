"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const openai_1 = require("langchain/chat_models/openai");
const anthropic_1 = require("langchain/chat_models/anthropic");
const ollama_1 = require("langchain/chat_models/ollama");
const schema_1 = require("langchain/schema");
const error_1 = require("../middleware/error");
const constants_1 = require("../config/constants");
const DEFAULT_OLLAMA_MODEL = 'llama3:latest';
const DEFAULT_OPENAI_MODEL = 'o3-mini';
const DEFAULT_ANTHROPIC_MODEL = 'claude-3-5-sonnet';
class ChatService {
    constructor(config) {
        switch (config.provider) {
            case 'openai':
                if (!config.apiKey) {
                    throw new error_1.AppError(400, 'OpenAI API key is required');
                }
                this.model = new openai_1.ChatOpenAI({
                    openAIApiKey: config.apiKey,
                    modelName: config.model || DEFAULT_OPENAI_MODEL,
                    temperature: config.temperature,
                    maxTokens: config.maxTokens,
                    streaming: true,
                });
                break;
            case 'anthropic':
                if (!config.apiKey) {
                    throw new error_1.AppError(400, 'Anthropic API key is required');
                }
                this.model = new anthropic_1.ChatAnthropic({
                    anthropicApiKey: config.apiKey,
                    modelName: config.model || DEFAULT_ANTHROPIC_MODEL,
                    temperature: config.temperature,
                    streaming: true,
                });
                break;
            case 'ollama':
                // Ensure we use a valid Ollama model name
                const ollamaModel = this.getOllamaModelName(config.model);
                this.model = new ollama_1.ChatOllama({
                    baseUrl: config.baseUrl || constants_1.OLLAMA_BASE_URL,
                    model: ollamaModel,
                    temperature: config.temperature,
                });
                break;
            default:
                throw new error_1.AppError(400, 'Invalid provider');
        }
    }
    getOllamaModelName(model = DEFAULT_OLLAMA_MODEL) {
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
    convertToLangChainMessages(messages) {
        return messages.map(msg => {
            switch (msg.role) {
                case 'user':
                    return new schema_1.HumanMessage(msg.content);
                case 'assistant':
                    return new schema_1.AIMessage(msg.content);
                case 'system':
                    return new schema_1.SystemMessage(msg.content);
                default:
                    throw new error_1.AppError(400, `Invalid message role: ${msg.role}`);
            }
        });
    }
    getMessageContent(content) {
        if (typeof content === 'string') {
            return content;
        }
        if (Array.isArray(content)) {
            return content.map(part => typeof part === 'string' ? part : JSON.stringify(part)).join('');
        }
        return String(content);
    }
    convertMessage(message) {
        return {
            role: message.role || 'user',
            content: message.content || message,
        };
    }
    async streamChat(messages, onToken) {
        const chatMessages = messages.map(msg => this.convertMessage(msg));
        const langChainMessages = this.convertToLangChainMessages(chatMessages);
        const stream = await this.model.stream(langChainMessages);
        for await (const chunk of stream) {
            if (chunk.content) {
                onToken(this.getMessageContent(chunk.content));
            }
        }
    }
    async chat(messages) {
        const chatMessages = messages.map(msg => this.convertMessage(msg));
        const langChainMessages = this.convertToLangChainMessages(chatMessages);
        const response = await this.model.call(langChainMessages);
        return this.getMessageContent(response.content);
    }
}
exports.ChatService = ChatService;
