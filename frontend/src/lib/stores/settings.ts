import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OpenAIChatModel = 
  | 'gpt-4o'                        // Latest GPT-4 Optimized
  | 'gpt-4o-2024-08-06'            // Specific version of GPT-4 Optimized
  | 'chatgpt-4o-latest'            // Latest used in ChatGPT
  | 'gpt-4o-mini'                  // Mini version of GPT-4 Optimized
  | 'gpt-4o-mini-2024-07-18'       // Specific version of GPT-4 Mini
  | 'o1'                           // Latest O1 model
  | 'o1-2024-12-17'                // Specific version of O1
  | 'o1-mini'                      // Mini version of O1
  | 'o1-mini-2024-09-12'           // Specific version of O1 Mini
  | 'o3-mini'                      // Latest O3 Mini
  | 'o3-mini-2025-01-31'           // Specific version of O3 Mini
  | 'o1-preview'                   // Latest O1 Preview
  | 'o1-preview-2024-09-12'        // Specific version of O1 Preview
  | 'gpt-4o-realtime-preview'      // Latest Realtime Preview
  | 'gpt-4o-realtime-preview-2024-12-17' // Specific version of Realtime Preview

export type AnthropicChatModel =
  | 'claude-3-5-sonnet'    // Latest Claude model
  | 'claude-3-sonnet'      // Previous Claude model
  | 'claude-2.1'           // Legacy Claude model

export type OllamaChatModel =
  | 'llama2:latest'        // Latest Llama 2
  | 'llama2-uncensored'    // Uncensored Llama 2
  | 'mistral'              // Mistral 7B
  | 'mixtral'              // Mixtral 8x7B
  | 'neural-chat'          // Neural Chat
  | 'codellama'            // Code Llama
  | 'phi'                  // Microsoft Phi-2
  | 'vicuna'               // Vicuna
  | 'orca-mini'            // Orca Mini
  | 'llama3.2:latest'      // Latest Llama 3.2

export type ChatModelType = OpenAIChatModel | AnthropicChatModel | OllamaChatModel;

export type EmbeddingModelType =
  | 'text-embedding-3-large'    // Latest OpenAI embedding model
  | 'text-embedding-3-small'    // Smaller, cost-effective OpenAI embedding model
  | 'text-embedding-ada-002'    // Legacy OpenAI embedding model
  | 'llama2-embedding'          // Local Llama 2 embeddings
  | 'nomic-embed-text'          // Nomic AI embeddings

export const OLLAMA_DEFAULT_URL = 'http://127.0.0.1:11434';

export interface ModelProvider {
  type: 'openai' | 'anthropic' | 'ollama';
  baseUrl?: string;          // For Ollama, default is http://localhost:11434
  apiKey?: string;           // For OpenAI and Anthropic
}

export interface AIModelSettings {
  chatModel: ChatModelType;
  ollamaChatModel: OllamaChatModel;  // Model for Ollama
  openaiChatModel: OpenAIChatModel;  // Model for OpenAI
  embeddingModel: EmbeddingModelType;
  provider: ModelProvider;
  temperature: number;
  maxTokens: number;
  streamResponses: boolean;
  useContextWindow: boolean;
}

interface SettingsState {
  aiModels: AIModelSettings;
  updateAIModels: (settings: Partial<AIModelSettings>) => void;
}

const defaultAISettings: AIModelSettings = {
  chatModel: 'llama3.2:latest',
  ollamaChatModel: 'llama3.2:latest',  // Default Ollama model
  openaiChatModel: 'gpt-4o',           // Default OpenAI model
  embeddingModel: 'text-embedding-3-large',
  provider: {
    type: 'ollama',
    baseUrl: OLLAMA_DEFAULT_URL,
  },
  temperature: 0.7,
  maxTokens: 1000,
  streamResponses: true,
  useContextWindow: true,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      aiModels: defaultAISettings,
      updateAIModels: (settings) =>
        set((state) => ({
          aiModels: { ...state.aiModels, ...settings },
        })),
    }),
    {
      name: 'secondbrain-settings',
    }
  )
);
