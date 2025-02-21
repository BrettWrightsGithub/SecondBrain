import { OllamaService } from '../ollama.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('OllamaService', () => {
    let ollamaService: OllamaService;
    const defaultBaseUrl = 'http://127.0.0.1:11434';
    const defaultModel = 'llama2';
    const testPrompt = 'test prompt';

    beforeEach(() => {
        ollamaService = new OllamaService();
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should initialize with default values', () => {
            expect(ollamaService['baseUrl']).toBe(defaultBaseUrl);
            expect(ollamaService['model']).toBe(defaultModel);
        });
    });

    describe('generateResponse', () => {
        const expectedResponse = 'test response';

        it('should successfully generate a response', async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: {
                    response: expectedResponse
                }
            });

            const response = await ollamaService.generateResponse(testPrompt);
            
            expect(response).toBe(expectedResponse);
            expect(mockedAxios.post).toHaveBeenCalledWith(
                `${defaultBaseUrl}/api/generate`,
                {
                    model: defaultModel,
                    prompt: testPrompt,
                    stream: false
                }
            );
        });

        it('should handle network errors', async () => {
            mockedAxios.post.mockRejectedValueOnce(new Error('Failed to generate response from Ollama'));

            await expect(ollamaService.generateResponse(testPrompt))
                .rejects
                .toThrow('Failed to generate response from Ollama');
        });

        it('should handle invalid response format', async () => {
            mockedAxios.post.mockResolvedValueOnce({
                data: 'invalid format'
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
                data: {
                    models: mockModels
                }
            });

            const models = await ollamaService.listModels();
            
            expect(models).toEqual(mockModels);
            expect(mockedAxios.get).toHaveBeenCalledWith(
                `${defaultBaseUrl}/api/tags`
            );
        });

        it('should handle network errors', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error('Failed to list Ollama models'));

            await expect(ollamaService.listModels())
                .rejects
                .toThrow('Failed to list Ollama models');
        });

        it('should handle invalid response format', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                data: 'invalid format'
            });

            await expect(ollamaService.listModels())
                .rejects
                .toThrow('Invalid response format from Ollama');
        });
    });

    describe('checkHealth', () => {
        it('should return true when Ollama is healthy', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                status: 200
            });

            const isHealthy = await ollamaService.checkHealth();
            
            expect(isHealthy).toBe(true);
            expect(mockedAxios.get).toHaveBeenCalledWith(defaultBaseUrl);
        });

        it('should return false when Ollama is not healthy', async () => {
            mockedAxios.get.mockRejectedValueOnce(new Error());

            const isHealthy = await ollamaService.checkHealth();
            
            expect(isHealthy).toBe(false);
        });

        it('should return false when Ollama returns non-200 status', async () => {
            mockedAxios.get.mockResolvedValueOnce({
                status: 500
            });

            const isHealthy = await ollamaService.checkHealth();
            
            expect(isHealthy).toBe(false);
        });
    });
});
