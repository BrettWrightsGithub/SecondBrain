export interface OllamaModelDetails {
  format: string;
  family: string;
  families: string[] | null;
  parameter_size: string;
  quantization_level: string;
}

export interface OllamaModel {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: OllamaModelDetails;
}

export interface OllamaModelList {
  models: OllamaModel[];
}

export interface OllamaStatus {
  status: string;
  digest?: string;
  total?: number;
  completed?: number;
}

export class OllamaService {
  private baseUrl: string;
  private abortController: AbortController | null = null;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
    // Cancel any existing requests
    if (this.abortController) {
      this.abortController.abort();
    }
    
    this.abortController = new AbortController();
    const timeoutId = setTimeout(() => this.abortController?.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: this.abortController.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/tags`);
      return response.ok;
    } catch {
      return false;
    }
  }

  async listModels(): Promise<OllamaModel[]> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/api/tags`, {}, 10000);
      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }
      const data: OllamaModelList = await response.json();
      return data.models;
    } catch (error) {
      console.error('Error listing models:', error);
      throw error;
    }
  }

  async pullModel(modelName: string, onProgress?: (status: OllamaStatus) => void): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/pull`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: modelName }),
      });

      if (!response.ok) {
        throw new Error('Failed to pull model');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const status: OllamaStatus = JSON.parse(line);
            onProgress?.(status);
          } catch (e) {
            console.error('Error parsing status:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error pulling model:', error);
      throw error;
    }
  }

  async deleteModel(modelName: string): Promise<void> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseUrl}/api/delete`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: modelName }),
        },
        10000
      );

      if (!response.ok) {
        throw new Error('Failed to delete model');
      }
    } catch (error) {
      console.error('Error deleting model:', error);
      throw error;
    }
  }

  async getTags(): Promise<string[]> {
    try {
      const response = await fetch('/api/ollama/tags');
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error getting Ollama tags:', error);
      throw error;
    }
  }
}
