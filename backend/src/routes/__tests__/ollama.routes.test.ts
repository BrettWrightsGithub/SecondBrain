import request from 'supertest';
import express from 'express';
import { OllamaService } from '../../services/ollama.service';
import ollamaRoutes from '../ollama.routes';

jest.mock('../../services/ollama.service');
const MockedOllamaService = OllamaService as jest.MockedClass<typeof OllamaService>;

describe('Ollama Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        jest.clearAllMocks();
        app = express();
        app.use(express.json());
        app.use('/api/ollama', ollamaRoutes);
    });

    describe('POST /api/ollama/generate', () => {
        it('should generate a response successfully', async () => {
            const mockResponse = 'Generated response';
            MockedOllamaService.prototype.generateResponse.mockResolvedValueOnce(mockResponse);

            const response = await request(app)
                .post('/api/ollama/generate')
                .send({ prompt: 'test prompt' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ response: mockResponse });
        });

        it('should handle errors during generation', async () => {
            MockedOllamaService.prototype.generateResponse.mockRejectedValueOnce(new Error('Generation failed'));

            const response = await request(app)
                .post('/api/ollama/generate')
                .send({ prompt: 'test prompt' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to generate response' });
        });
    });

    describe('GET /api/ollama/models', () => {
        it('should list models successfully', async () => {
            const mockModels = [{ name: 'model1' }, { name: 'model2' }];
            MockedOllamaService.prototype.listModels.mockResolvedValueOnce(mockModels);

            const response = await request(app)
                .get('/api/ollama/models');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ models: mockModels });
        });

        it('should handle errors when listing models', async () => {
            MockedOllamaService.prototype.listModels.mockRejectedValueOnce(new Error('Failed to list models'));

            const response = await request(app)
                .get('/api/ollama/models');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to list models' });
        });
    });

    describe('GET /api/ollama/health', () => {
        it('should return healthy status when service is healthy', async () => {
            MockedOllamaService.prototype.checkHealth.mockResolvedValueOnce(true);

            const response = await request(app)
                .get('/api/ollama/health');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ healthy: true });
        });

        it('should return unhealthy status when service is not healthy', async () => {
            MockedOllamaService.prototype.checkHealth.mockResolvedValueOnce(false);

            const response = await request(app)
                .get('/api/ollama/health');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ healthy: false });
        });
    });

    describe('GET /api/ollama/local-models', () => {
        const mockModelsResponse = {
            data: {
                models: [
                    {
                        name: 'llama3:latest',
                        size: 4661224676,
                        modified_at: '2024-07-22T22:37:42.849216426-06:00',
                        details: {
                            parameter_size: '8.0B',
                            family: 'llama',
                            format: 'gguf',
                            quantization_level: 'Q4_0'
                        }
                    }
                ]
            },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {} as any
        };

        it('should fetch local models successfully', async () => {
            MockedOllamaService.prototype.fetchLocalModels.mockResolvedValueOnce(mockModelsResponse);

            const response = await request(app)
                .get('/api/ollama/local-models');

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                models: [{
                    name: 'llama3:latest',
                    size: 4661224676,
                    modifiedAt: '2024-07-22T22:37:42.849216426-06:00',
                    details: {
                        parameter_size: '8.0B',
                        family: 'llama',
                        format: 'gguf',
                        quantization_level: 'Q4_0'
                    }
                }]
            });
        });

        it('should handle errors when fetching local models', async () => {
            MockedOllamaService.prototype.fetchLocalModels.mockRejectedValueOnce(new Error('Failed to fetch models'));

            const response = await request(app)
                .get('/api/ollama/local-models');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to fetch local Ollama models' });
        });
    });
});
