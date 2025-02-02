import axios from 'axios';
import { OllamaModel, OllamaSettings, OllamaResponse } from '../types/ollama';

const API_BASE_URL = 'http://localhost:3001/api/ollama';

export const ollamaApi = {
    async getHealth(): Promise<boolean> {
        try {
            const response = await axios.get(`${API_BASE_URL}/health`);
            return response.data.status === 'healthy';
        } catch (error) {
            console.error('Error checking Ollama health:', error);
            return false;
        }
    },

    async getModels(): Promise<OllamaModel[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/models`);
            return response.data.models;
        } catch (error) {
            console.error('Error getting Ollama models:', error);
            throw error;
        }
    },

    async getSettings(): Promise<OllamaSettings> {
        try {
            const response = await axios.get(`${API_BASE_URL}/settings`);
            return response.data;
        } catch (error) {
            console.error('Error getting Ollama settings:', error);
            throw error;
        }
    },

    async updateSettings(settings: OllamaSettings): Promise<OllamaSettings> {
        try {
            const response = await axios.post(`${API_BASE_URL}/settings`, settings);
            return response.data;
        } catch (error) {
            console.error('Error updating Ollama settings:', error);
            throw error;
        }
    },

    async generateResponse(prompt: string): Promise<string> {
        try {
            const response = await axios.post<OllamaResponse>(`${API_BASE_URL}/generate`, { prompt });
            return response.data.response;
        } catch (error) {
            console.error('Error generating response:', error);
            throw error;
        }
    }
};
