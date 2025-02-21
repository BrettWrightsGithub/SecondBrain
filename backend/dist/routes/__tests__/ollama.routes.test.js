"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const ollama_service_1 = require("../../services/ollama.service");
const ollama_routes_1 = __importDefault(require("../ollama.routes"));
jest.mock('../../services/ollama.service');
const MockedOllamaService = ollama_service_1.OllamaService;
describe('Ollama Routes', () => {
    let app;
    beforeEach(() => {
        jest.clearAllMocks();
        app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use('/api/ollama', ollama_routes_1.default);
    });
    describe('POST /api/ollama/generate', () => {
        it('should generate a response successfully', async () => {
            const mockResponse = 'Generated response';
            MockedOllamaService.prototype.generateResponse.mockResolvedValueOnce(mockResponse);
            const response = await (0, supertest_1.default)(app)
                .post('/api/ollama/generate')
                .send({ prompt: 'test prompt' });
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ response: mockResponse });
        });
        it('should handle errors during generation', async () => {
            MockedOllamaService.prototype.generateResponse.mockRejectedValueOnce(new Error('Generation failed'));
            const response = await (0, supertest_1.default)(app)
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
            const response = await (0, supertest_1.default)(app)
                .get('/api/ollama/models');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ models: mockModels });
        });
        it('should handle errors when listing models', async () => {
            MockedOllamaService.prototype.listModels.mockRejectedValueOnce(new Error('Failed to list models'));
            const response = await (0, supertest_1.default)(app)
                .get('/api/ollama/models');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to list models' });
        });
    });
    describe('GET /api/ollama/health', () => {
        it('should return healthy status when service is healthy', async () => {
            MockedOllamaService.prototype.checkHealth.mockResolvedValueOnce(true);
            const response = await (0, supertest_1.default)(app)
                .get('/api/ollama/health');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ healthy: true });
        });
        it('should return unhealthy status when service is not healthy', async () => {
            MockedOllamaService.prototype.checkHealth.mockResolvedValueOnce(false);
            const response = await (0, supertest_1.default)(app)
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
            config: {}
        };
        it('should fetch local models successfully', async () => {
            MockedOllamaService.prototype.fetchLocalModels.mockResolvedValueOnce(mockModelsResponse);
            const response = await (0, supertest_1.default)(app)
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
            const response = await (0, supertest_1.default)(app)
                .get('/api/ollama/local-models');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to fetch local Ollama models' });
        });
    });
});
