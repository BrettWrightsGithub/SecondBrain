import express from 'express';
import axios from 'axios';
import { OllamaService } from '../services/ollama.service';
import { OLLAMA_BASE_URL } from '../config/constants';

const router = express.Router();
const ollamaService = new OllamaService();

router.get('/health', async (_req, res) => {
    const isHealthy = await ollamaService.checkHealth();
    res.json({ healthy: isHealthy });
});

router.get('/models', async (_req, res) => {
    try {
        const models = await ollamaService.listModels();
        res.json({ models });
    } catch (error) {
        res.status(500).json({ error: 'Failed to list models' });
    }
});

router.get('/local-models', async (req, res) => {
  try {
    const response = await ollamaService.fetchLocalModels();
    const models = response.data.models.map((model: any) => ({
      name: model.name,
      size: model.size,
      modifiedAt: model.modified_at,
      details: model.details
    }));
    res.json({ models });
  } catch (error) {
    console.error('Error fetching local Ollama models:', error);
    res.status(500).json({ error: 'Failed to fetch local Ollama models' });
  }
});

router.get('/tags', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_BASE_URL}/api/tags`);
    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Ollama tags:', error);
    res.status(500).json({ error: 'Failed to fetch Ollama tags' });
  }
});

router.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await ollamaService.generateResponse(prompt);
    res.json({ response });
  } catch (error) {
    console.error('Error generating response:', error);
    res.status(500).json({ error: 'Failed to generate response' });
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

export default router;
