import axios from 'axios';
import { AppError } from '../middleware/error';
import { OLLAMA_BASE_URL } from '../config/constants';

export interface OllamaModel {
    name: string;
}

export interface OllamaSettings {
    baseUrl: string;
    selectedModel: string;
}

export class OllamaService {
    private baseUrl: string;
    private model: string;

    constructor(baseUrl: string = OLLAMA_BASE_URL, model: string = 'llama2') {
        this.baseUrl = baseUrl;
        this.model = model;
    }

    getSettings(): OllamaSettings {
        return {
            baseUrl: this.baseUrl,
            selectedModel: this.model
        };
    }

    setSettings(settings: OllamaSettings): void {
        this.baseUrl = settings.baseUrl;
        this.model = settings.selectedModel;
    }

    async generateResponse(prompt: string): Promise<string> {
        try {
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt,
                stream: false
            });

            if (!response.data || !response.data.response) {
                throw new Error('Invalid response format from Ollama');
            }

            return response.data.response;
        } catch (error) {
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
            const response = await axios.get(`${this.baseUrl}/api/tags`);
            return response;
        } catch (error) {
            console.error('Error fetching local models:', error);
            throw new AppError(500, 'Failed to fetch local models');
        }
    }

    async listModels(): Promise<OllamaModel[]> {
        try {
            const response = await axios.get(`${this.baseUrl}/api/tags`);

            if (!response.data || !response.data.models) {
                throw new Error('Invalid response format from Ollama');
            }

            return response.data.models;
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Invalid response format from Ollama') {
                    throw error;
                }
                throw new Error('Failed to list Ollama models');
            }
            throw new Error('Failed to list Ollama models');
        }
    }

    async checkHealth(): Promise<boolean> {
        try {
            const response = await axios.get(this.baseUrl);
            return response.status === 200;
        } catch (error) {
            return false;
        }
    }
}
