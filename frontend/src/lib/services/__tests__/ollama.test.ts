import { OllamaService } from '../ollama';
import { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

describe('OllamaService', () => {
    const baseUrl = 'http://localhost:11434';
    let ollamaService: OllamaService;

    beforeEach(() => {
        ollamaService = new OllamaService(baseUrl);
        fetchMock.resetMocks();
    });

    describe('checkConnection', () => {
        it('should return true when server is healthy', async () => {
            fetchMock.mockResponseOnce('', { status: 200 });
            const result = await ollamaService.checkConnection();
            expect(result).toBe(true);
            expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/api/tags`);
        });

        it('should return false when server is unhealthy', async () => {
            fetchMock.mockReject(new Error('Connection failed'));
            const result = await ollamaService.checkConnection();
            expect(result).toBe(false);
        });
    });

    describe('listModels', () => {
        const mockModels = [
            {
                name: 'llama2',
                modified_at: '2024-01-26T15:00:00Z',
                size: 1000,
                digest: 'abc123',
                details: {
                    format: 'gguf',
                    family: 'llama',
                    families: ['llama'],
                    parameter_size: '7B',
                    quantization_level: 'Q4_0'
                }
            }
        ];

        it('should return list of models when successful', async () => {
            fetchMock.mockResponseOnce(JSON.stringify({ models: mockModels }));
            const result = await ollamaService.listModels();
            expect(result).toEqual(mockModels);
            expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/api/tags`);
        });

        it('should throw error when request fails', async () => {
            fetchMock.mockReject(new Error('Failed to fetch models'));
            await expect(ollamaService.listModels()).rejects.toThrow('Failed to fetch models');
        });
    });

    describe('pullModel', () => {
        const modelName = 'llama2';
        const mockStatus = { status: 'downloading', completed: 50, total: 100 };

        it('should handle model pulling successfully', async () => {
            const mockResponse = new ReadableStream({
                start(controller) {
                    controller.enqueue(new TextEncoder().encode(JSON.stringify(mockStatus) + '\n'));
                    controller.enqueue(new TextEncoder().encode(JSON.stringify({ status: 'success' }) + '\n'));
                    controller.close();
                }
            });

            fetchMock.mockResponseOnce('', {
                status: 200,
                body: mockResponse
            });

            const onProgress = jest.fn();
            await ollamaService.pullModel(modelName, onProgress);

            expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/api/pull`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model: modelName }),
            });
            expect(onProgress).toHaveBeenCalledWith(mockStatus);
        });

        it('should throw error when pull fails', async () => {
            fetchMock.mockReject(new Error('Failed to pull model'));
            await expect(ollamaService.pullModel(modelName)).rejects.toThrow('Failed to pull model');
        });
    });

    describe('deleteModel', () => {
        const modelName = 'llama2';

        it('should delete model successfully', async () => {
            fetchMock.mockResponseOnce('', { status: 200 });
            await ollamaService.deleteModel(modelName);
            expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/api/delete`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model: modelName }),
            });
        });

        it('should throw error when delete fails', async () => {
            fetchMock.mockReject(new Error('Failed to delete model'));
            await expect(ollamaService.deleteModel(modelName)).rejects.toThrow('Failed to delete model');
        });
    });

    describe('generateResponse', () => {
        const mockPrompt = 'Hello, world!';
        const mockResponse = { response: 'Hi there!' };

        it('should return generated response when successful', async () => {
            fetchMock.mockResponseOnce(JSON.stringify(mockResponse));
            const result = await ollamaService.generateResponse(mockPrompt);
            expect(result).toBe(mockResponse.response);
            expect(fetchMock).toHaveBeenCalledWith(`${baseUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: mockPrompt, stream: false }),
            });
        });

        it('should throw error when request fails', async () => {
            fetchMock.mockReject(new Error('Generation failed'));
            await expect(ollamaService.generateResponse(mockPrompt)).rejects.toThrow('Generation failed');
        });

        it('should throw error when prompt is empty', async () => {
            await expect(ollamaService.generateResponse('')).rejects.toThrow('Prompt cannot be empty');
            expect(fetchMock).not.toHaveBeenCalled();
        });
    });
});
