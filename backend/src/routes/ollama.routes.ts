import { Router } from 'express';
import { OllamaService } from '../services/ollama.service';

const router = Router();
const ollamaService = OllamaService.getInstance();

router.post('/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }
        const response = await ollamaService.generateResponse(prompt);
        res.json({ response });
    } catch (error) {
        console.error('Error in generate endpoint:', error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

router.get('/models', async (req, res) => {
    try {
        const models = await ollamaService.listModels();
        res.json({ models });
    } catch (error) {
        console.error('Error in models endpoint:', error);
        res.status(500).json({ error: 'Failed to list models' });
    }
});

router.get('/settings', async (req, res) => {
    try {
        const settings = ollamaService.getSettings();
        res.json(settings);
    } catch (error) {
        console.error('Error in settings endpoint:', error);
        res.status(500).json({ error: 'Failed to get settings' });
    }
});

router.post('/settings', async (req, res) => {
    try {
        const settings = req.body;
        ollamaService.setSettings(settings);
        res.json(ollamaService.getSettings());
    } catch (error) {
        console.error('Error in settings endpoint:', error);
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

router.get('/health', async (req, res) => {
    try {
        const isHealthy = await ollamaService.checkHealth();
        res.json({ status: isHealthy ? 'healthy' : 'unhealthy' });
    } catch (error) {
        console.error('Error in health endpoint:', error);
        res.status(500).json({ error: 'Failed to check health' });
    }
});

export default router;
