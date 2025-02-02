"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const ollama_service_1 = require("../ollama.service");
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('OllamaService', () => {
    let ollamaService;
    const defaultBaseUrl = 'http://localhost:11434';
    const defaultModel = 'llama2';
    beforeEach(() => {
        ollamaService = new ollama_service_1.OllamaService();
        jest.clearAllMocks();
    });
    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('constructor', () => {
        it('should initialize with default values', () => {
            expect(ollamaService['baseUrl']).toBe(defaultBaseUrl);
            expect(ollamaService['model']).toBe(defaultModel);
        });
        it('should initialize with custom values', () => {
            const customUrl = 'http://custom:11434';
            const customModel = 'custom-model';
            ollamaService = new ollama_service_1.OllamaService(customUrl, customModel);
            expect(ollamaService['baseUrl']).toBe(customUrl);
            expect(ollamaService['model']).toBe(customModel);
        });
        it('should throw error if baseUrl is invalid', () => {
            expect(() => new ollama_service_1.OllamaService('invalid-url'))
                .toThrow('Invalid base URL provided');
        });
    });
    describe('generateResponse', () => {
        const testPrompt = 'test prompt';
        const expectedResponse = 'test response';
        it('should successfully generate a response', async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: { response: expectedResponse }
            });
            const response = await ollamaService.generateResponse(testPrompt);
            expect(response).toBe(expectedResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith(`${defaultBaseUrl}/api/generate`, {
                model: defaultModel,
                prompt: testPrompt,
                stream: false
            });
        });
        it('should handle empty prompt', async () => {
            await expect(ollamaService.generateResponse(''))
                .rejects
                .toThrow('Prompt cannot be empty');
        });
        it('should handle null prompt', async () => {
            await expect(ollamaService.generateResponse(null))
                .rejects
                .toThrow('Prompt cannot be empty');
        });
        it('should handle network errors', async () => {
            const networkError = new Error('Network error');
            mockedAxios.post.mockRejectedValueOnce(networkError);
            await expect(ollamaService.generateResponse(testPrompt))
                .rejects
                .toThrow('Failed to generate response from Ollama');
        });
        it('should handle invalid response format', async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: { invalidKey: 'invalid response' }
            });
            await expect(ollamaService.generateResponse(testPrompt))
                .rejects
                .toThrow('Invalid response format from Ollama');
        });
    });
    describe('listModels', () => {
        const mockModels = [
            { name: 'model1' },
            { name: 'model2' }
        ];
        it('should successfully list models', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { models: mockModels }
            });
            const models = await ollamaService.listModels();
            expect(models).toEqual(['model1', 'model2']);
            expect(mockedAxios.get).toHaveBeenCalledWith(`${defaultBaseUrl}/api/tags`);
        });
        it('should handle empty models list', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { models: [] }
            });
            const models = await ollamaService.listModels();
            expect(models).toEqual([]);
        });
        it('should handle network errors', async () => {
            const networkError = new Error('Network error');
            mockedAxios.get.mockRejectedValueOnce(networkError);
            await expect(ollamaService.listModels())
                .rejects
                .toThrow('Failed to list Ollama models');
        });
        it('should handle invalid response format', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: { invalidKey: [] }
            });
            await expect(ollamaService.listModels())
                .rejects
                .toThrow('Invalid response format from Ollama');
        });
    });
    describe('checkHealth', () => {
        it('should return true when Ollama is healthy', async () => {
            mockedAxios.get.mockResolvedValueOnce({});
            const isHealthy = await ollamaService.checkHealth();
            expect(isHealthy).toBe(true);
            expect(mockedAxios.get).toHaveBeenCalledWith(defaultBaseUrl);
        });
        it('should return false when Ollama is not healthy', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error());
            const isHealthy = await ollamaService.checkHealth();
            expect(isHealthy).toBe(false);
        });
        it('should handle timeout appropriately', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('timeout'));
            const isHealthy = await ollamaService.checkHealth();
            expect(isHealthy).toBe(false);
        });
    });
});
