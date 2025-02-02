import axios from 'axios';
import { OllamaModel, OllamaModelResponse, OllamaSettings } from '../types/ollama';

export class OllamaService {
    private baseUrl: string;
    private model: string;
    private static instance: OllamaService;

    constructor(
        baseUrl: string = 'http://127.0.0.1:11434',
        model: string = 'llama2'
    ) {
        this.baseUrl = baseUrl;
        this.model = model;
        if (!this.isValidUrl(this.baseUrl)) {
            throw new Error('Invalid base URL provided');
        }
    }

    public static getInstance(baseUrl?: string, model?: string): OllamaService {
        if (!OllamaService.instance) {
            OllamaService.instance = new OllamaService(
                baseUrl || 'http://127.0.0.1:11434',
                model || 'llama2'
            );
        }
        return OllamaService.instance;
    }

    private isValidUrl(urlString: string): boolean {
        try {
            new URL(urlString);
            return true;
        } catch (e) {
            return false;
        }
    }

    public setModel(model: string): void {
        this.model = model;
    }

    public getSettings(): OllamaSettings {
        return {
            selectedModel: this.model,
            baseUrl: this.baseUrl
        };
    }

    public setSettings(settings: OllamaSettings): void {
        if (!this.isValidUrl(settings.baseUrl)) {
            throw new Error('Invalid base URL provided');
        }
        this.baseUrl = settings.baseUrl;
        this.model = settings.selectedModel;
    }

    async generateResponse(prompt: string): Promise<string> {
        if (!prompt || prompt.trim().length === 0) {
            throw new Error('Prompt cannot be empty');
        }

        try {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: prompt,
                stream: false
            });

            if (!response.data || !response.data.response) {
                throw new Error('Invalid response format from Ollama');
            }

            return response.data.response;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error generating response from Ollama:', error);
                throw error;
            }
            console.error('Error generating response from Ollama:', error);
            throw new Error('Failed to generate response from Ollama');
        }
    }

    async listModels(): Promise<OllamaModel[]> {
        try {
            const response = await axios.get<OllamaModelResponse>(`${this.baseUrl}/api/tags`);
            if (!response.data || !response.data.models) {
                throw new Error('Invalid response format from Ollama');
            }
            return response.data.models;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error listing Ollama models:', error);
                throw error;
            }
            console.error('Error listing Ollama models:', error);
            throw new Error('Failed to list Ollama models');
        }
    }

    async checkHealth(): Promise<boolean> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`);
            return response.status === 200;
        } catch (error) {
            console.error('Error checking Ollama health:', error);
            return false;
        }
    }
}
