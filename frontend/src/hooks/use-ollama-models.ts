import { useState, useEffect } from 'react';

interface OllamaModel {
  name: string;
  size: number;
  modifiedAt: string;
  details: {
    parameter_size: string;
    family: string;
    format: string;
    quantization_level: string;
  };
}

export function useOllamaModels() {
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchModels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:3001/api/ollama/local-models');
      if (!response.ok) {
        throw new Error('Failed to fetch local models');
      }
      const data = await response.json();
      setModels(data.models || []);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch models'));
      console.error('Error fetching Ollama models:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  return {
    models,
    loading,
    error,
    refresh: fetchModels
  };
}
