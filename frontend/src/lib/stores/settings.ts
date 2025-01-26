import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OpenAIChatModel = 
  | 'gpt-4-turbo-preview'  // Latest GPT-4 Turbo
  | 'gpt-4-0125-preview'   // Specific version of GPT-4 Turbo
  | 'gpt-4-1106-preview'   // Previous GPT-4 Turbo
  | 'gpt-4'                // Base GPT-4
  | 'gpt-3.5-turbo-0125'   // Latest GPT-3.5 Turbo
  | 'gpt-3.5-turbo'        // GPT-3.5 Turbo

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

export type ChatModelType = OpenAIChatModel | AnthropicChatModel | OllamaChatModel;

export type EmbeddingModelType =
  | 'text-embedding-3-large'    // Latest OpenAI embedding model
  | 'text-embedding-3-small'    // Smaller, cost-effective OpenAI embedding model
  | 'text-embedding-ada-002'    // Legacy OpenAI embedding model
  | 'llama2-embedding'          // Local Llama 2 embeddings
  | 'nomic-embed-text'          // Nomic AI embeddings

export interface ModelProvider {
  type: 'openai' | 'anthropic' | 'ollama';
  baseUrl?: string;          // For Ollama, default is http://localhost:11434
  apiKey?: string;           // For OpenAI and Anthropic
}

export interface AIModelSettings {
  chatModel: ChatModelType;
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
  chatModel: 'gpt-4-turbo-preview',
  embeddingModel: 'text-embedding-3-large',
  provider: {
    type: 'openai',
  },
  temperature: 0.7,
  maxTokens: 4096,
  streamResponses: true,
  useContextWindow: true,
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      aiModels: defaultAISettings,
      updateAIModels: (settings) =>
        set((state) => ({
          aiModels: {
            ...state.aiModels,
            ...settings,
            // Merge provider settings if provided
            provider: settings.provider
              ? { ...state.aiModels.provider, ...settings.provider }
              : state.aiModels.provider,
          },
        })),
    }),
    {
      name: 'secondbrain-settings',
    }
  )
);
