import request from 'supertest';
import express from 'express';
import ollamaRoutes from '../ollama.routes';
import { OllamaService } from '../../services/ollama.service';
import { OllamaModel } from '../../types';
import { errorHandler } from '../../middleware/error';

jest.mock('../../services/ollama.service');

const MockedOllamaService = OllamaService as jest.MockedClass<typeof OllamaService>;

describe('Ollama Routes', () => {
    let app: express.Application;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/ollama', ollamaRoutes);
        app.use(errorHandler);
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    describe('POST /generate', () => {
        const testPrompt = 'test prompt';
        const expectedResponse = 'test response';

        beforeEach(() => {
            MockedOllamaService.prototype.generateResponse.mockReset();
        });

        it('should generate a response successfully', async () => {
            MockedOllamaService.prototype.generateResponse.mockResolvedValueOnce(expectedResponse);

            const response = await request(app)
                .post('/api/ollama/generate')
                .send({ prompt: testPrompt })
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({ response: expectedResponse });
            expect(MockedOllamaService.prototype.generateResponse).toHaveBeenCalledWith(testPrompt);
        });

        it('should return 400 when prompt is missing', async () => {
            const response = await request(app)
                .post('/api/ollama/generate')
                .send({})
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({ error: 'Prompt is required' });
            expect(MockedOllamaService.prototype.generateResponse).not.toHaveBeenCalled();
        });

        it('should return 400 when prompt is empty', async () => {
            const response = await request(app)
                .post('/api/ollama/generate')
                .send({ prompt: '' })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toEqual({ error: 'Prompt is required' });
            expect(MockedOllamaService.prototype.generateResponse).not.toHaveBeenCalled();
        });

        it('should return 500 when generation fails', async () => {
            MockedOllamaService.prototype.generateResponse.mockRejectedValueOnce(
                new Error('Generation failed')
            );

            const response = await request(app)
                .post('/api/ollama/generate')
                .send({ prompt: testPrompt })
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toEqual({ error: 'Failed to generate response' });
        });

        it('should handle large prompts', async () => {
            const largePrompt = 'a'.repeat(10000);
            MockedOllamaService.prototype.generateResponse.mockResolvedValueOnce(expectedResponse);

            const response = await request(app)
                .post('/api/ollama/generate')
                .send({ prompt: largePrompt })
                .expect(200);

            expect(response.body).toEqual({ response: expectedResponse });
        });
    });

    describe('GET /models', () => {
        const mockModels: OllamaModel[] = [
            { name: 'model1', modified_at: '2024-01-01', size: 1000 },
            { name: 'model2', modified_at: '2024-01-02', size: 2000 }
        ];

        beforeEach(() => {
            MockedOllamaService.prototype.listModels.mockReset();
            MockedOllamaService.prototype.listModels.mockResolvedValueOnce(mockModels);
        });

        it('should list models successfully', async () => {
            const response = await request(app)
                .get('/api/ollama/models')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({ models: mockModels });
        });

        it('should handle empty model list', async () => {
            MockedOllamaService.prototype.listModels.mockResolvedValueOnce([]);

            const response = await request(app)
                .get('/api/ollama/models')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({ models: [] });
        });

        it('should return 500 when listing models fails', async () => {
            MockedOllamaService.prototype.listModels.mockRejectedValueOnce(
                new Error('Failed to list models')
            );

            const response = await request(app)
                .get('/api/ollama/models')
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toEqual({ error: 'Failed to list models' });
        });
    });

    describe('GET /health', () => {
        beforeEach(() => {
            MockedOllamaService.prototype.checkHealth.mockReset();
        });

        it('should return healthy status', async () => {
            MockedOllamaService.prototype.checkHealth.mockResolvedValueOnce(true);

            const response = await request(app)
                .get('/api/ollama/health')
                .expect('Content-Type', /json/)
                .expect(200);

            expect(response.body).toEqual({ status: 'healthy' });
        });

        it('should return unhealthy status', async () => {
            MockedOllamaService.prototype.checkHealth.mockResolvedValueOnce(false);

            const response = await request(app)
                .get('/api/ollama/health')
                .expect('Content-Type', /json/)
                .expect(503);

            expect(response.body).toEqual({ status: 'unhealthy' });
        });

        it('should return 500 when health check fails', async () => {
            MockedOllamaService.prototype.checkHealth.mockRejectedValueOnce(
                new Error('Health check failed')
            );

            const response = await request(app)
                .get('/api/ollama/health')
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toEqual({ error: 'Failed to check health' });
        });

        it('should handle timeout during health check', async () => {
            MockedOllamaService.prototype.checkHealth.mockRejectedValueOnce(
                new Error('timeout')
            );

            const response = await request(app)
                .get('/api/ollama/health')
                .expect('Content-Type', /json/)
                .expect(500);

            expect(response.body).toEqual({ error: 'Failed to check health' });
        });
    });
});
