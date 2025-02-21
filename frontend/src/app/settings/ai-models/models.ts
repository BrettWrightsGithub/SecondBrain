import type { ChatModelType, EmbeddingModelType } from "@/lib/stores/settings";

interface ModelOption {
  value: string;
  label: string;
  description: string;
}

interface ModelGroups {
  openai: ModelOption[];
  anthropic: ModelOption[];
  ollama: ModelOption[];
}

export const chatModels: ModelGroups = {
  openai: [
    {
      value: "gpt-4o",
      label: "GPT-4 Optimized (Latest)",
      description: "Latest version of GPT-4 Optimized",
    },
    {
      value: "chatgpt-4o-latest",
      label: "ChatGPT-4 Optimized",
      description: "Latest version used in ChatGPT",
    },
    {
      value: "gpt-4o-mini",
      label: "GPT-4 Optimized Mini (Latest)",
      description: "Smaller, faster version of GPT-4 Optimized",
    },
    {
      value: "o3-mini",
      label: "O3 Mini (Latest)",
      description: "Latest O3 Mini model, balanced performance",
    },
    {
      value: "o1",
      label: "O1 (Latest)",
      description: "Latest O1 model, high performance",
    },
    {
      value: "o1-mini",
      label: "O1 Mini (Latest)",
      description: "Latest O1 Mini model, fast responses",
    },
    {
      value: "o1-preview",
      label: "O1 Preview",
      description: "Preview of next O1 model",
    },
    {
      value: "gpt-4o-realtime-preview",
      label: "GPT-4 Optimized Realtime Preview",
      description: "Preview of realtime optimized model",
    },
  ],
  anthropic: [
    {
      value: "claude-3-5-sonnet",
      label: "Claude 3.5 Sonnet",
      description: "Latest Claude model, best performance",
    },
    {
      value: "claude-3-sonnet",
      label: "Claude 3 Sonnet",
      description: "Previous Claude model",
    },
    {
      value: "claude-2.1",
      label: "Claude 2.1",
      description: "Legacy Claude model",
    },
  ],
  ollama: [
    {
      value: "llama2:latest",
      label: "Llama 2",
      description: "Latest version of Llama 2",
    },
    {
      value: "llama2-uncensored",
      label: "Llama 2 Uncensored",
      description: "Uncensored version of Llama 2",
    },
    {
      value: "mistral",
      label: "Mistral 7B",
      description: "Efficient 7B parameter model",
    },
    {
      value: "mixtral",
      label: "Mixtral 8x7B",
      description: "Mixture of experts model",
    },
    {
      value: "neural-chat",
      label: "Neural Chat",
      description: "Optimized for chat interactions",
    },
    {
      value: "codellama",
      label: "Code Llama",
      description: "Specialized for code generation",
    },
    {
      value: "phi",
      label: "Microsoft Phi-2",
      description: "Small but powerful model",
    },
    {
      value: "vicuna",
      label: "Vicuna",
      description: "Fine-tuned chat model",
    },
    {
      value: "orca-mini",
      label: "Orca Mini",
      description: "Lightweight chat model",
    },
  ],
} as const;

export const embeddingModels: ModelGroups = {
  openai: [
    {
      value: "text-embedding-3-large",
      label: "Text Embedding 3 Large",
      description: "Latest OpenAI embedding model",
    },
    {
      value: "text-embedding-3-small",
      label: "Text Embedding 3 Small",
      description: "Smaller, cost-effective embedding model",
    },
    {
      value: "text-embedding-ada-002",
      label: "Text Embedding Ada 002",
      description: "Legacy embedding model",
    },
  ],
  anthropic: [] as const,
  ollama: [
    {
      value: "llama2-embedding",
      label: "Llama 2 Embeddings",
      description: "Local Llama 2 embeddings",
    },
    {
      value: "nomic-embed-text",
      label: "Nomic Embed Text",
      description: "Nomic AI embeddings",
    },
  ],
} as const;
