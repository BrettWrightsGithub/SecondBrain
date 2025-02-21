"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const axios_1 = __importDefault(require("axios"));
const error_1 = require("../middleware/error");
const constants_1 = require("../config/constants");
class OllamaService {
    constructor(baseUrl = constants_1.OLLAMA_BASE_URL, model = 'llama2') {
        this.baseUrl = baseUrl;
        this.model = model;
    }
    getSettings() {
        return {
            baseUrl: this.baseUrl,
            selectedModel: this.model
        };
    }
    setSettings(settings) {
        this.baseUrl = settings.baseUrl;
        this.model = settings.selectedModel;
    }
    async generateResponse(prompt) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt,
                stream: false
            });
            if (!response.data || !response.data.response) {
                throw new Error('Invalid response format from Ollama');
            }
            return response.data.response;
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Invalid response format from Ollama') {
                    throw error;
                }
                throw new Error('Failed to generate response from Ollama');
            }
            throw new Error('Failed to generate response from Ollama');
        }
    }
    async fetchLocalModels() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/api/tags`);
            return response;
        }
        catch (error) {
            console.error('Error fetching local models:', error);
            throw new error_1.AppError(500, 'Failed to fetch local models');
        }
    }
    async listModels() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/api/tags`);
            if (!response.data || !response.data.models) {
                throw new Error('Invalid response format from Ollama');
            }
            return response.data.models;
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Invalid response format from Ollama') {
                    throw error;
                }
                throw new Error('Failed to list Ollama models');
            }
            throw new Error('Failed to list Ollama models');
        }
    }
    async checkHealth() {
        try {
            const response = await axios_1.default.get(this.baseUrl);
            return response.status === 200;
        }
        catch (error) {
            return false;
        }
    }
}
exports.OllamaService = OllamaService;
