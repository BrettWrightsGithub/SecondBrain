"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaService = void 0;
const axios_1 = __importDefault(require("axios"));
class OllamaService {
    constructor(baseUrl = 'http://127.0.0.1:11434', model = 'llama2') {
        this.baseUrl = baseUrl;
        this.model = model;
        if (!this.isValidUrl(this.baseUrl)) {
            throw new Error('Invalid base URL provided');
        }
    }
    static getInstance(baseUrl, model) {
        if (!OllamaService.instance) {
            OllamaService.instance = new OllamaService(baseUrl || 'http://127.0.0.1:11434', model || 'llama2');
        }
        return OllamaService.instance;
    }
    isValidUrl(urlString) {
        try {
            new URL(urlString);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    setModel(model) {
        this.model = model;
    }
    getSettings() {
        return {
            selectedModel: this.model,
            baseUrl: this.baseUrl
        };
    }
    setSettings(settings) {
        if (!this.isValidUrl(settings.baseUrl)) {
            throw new Error('Invalid base URL provided');
        }
        this.baseUrl = settings.baseUrl;
        this.model = settings.selectedModel;
    }
    async generateResponse(prompt) {
        if (!prompt || prompt.trim().length === 0) {
            throw new Error('Prompt cannot be empty');
        }
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: false
            });
            if (!response.data || !response.data.response) {
                throw new Error('Invalid response format from Ollama');
            }
            return response.data.response;
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error generating response from Ollama:', error);
                throw error;
            }
            console.error('Error generating response from Ollama:', error);
            throw new Error('Failed to generate response from Ollama');
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
                console.error('Error listing Ollama models:', error);
                throw error;
            }
            console.error('Error listing Ollama models:', error);
            throw new Error('Failed to list Ollama models');
        }
    }
    async checkHealth() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/api/tags`);
            return response.status === 200;
        }
        catch (error) {
            console.error('Error checking Ollama health:', error);
            return false;
        }
    }
}
exports.OllamaService = OllamaService;
