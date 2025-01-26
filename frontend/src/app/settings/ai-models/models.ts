export const chatModels = {
  openai: [
    {
      value: "gpt-4-turbo-preview",
      label: "GPT-4 Turbo",
      description: "Latest GPT-4 model with improved performance",
    },
    {
      value: "gpt-4-0125-preview",
      label: "GPT-4 Turbo (0125)",
      description: "Specific version of GPT-4 Turbo",
    },
    {
      value: "gpt-4",
      label: "GPT-4",
      description: "Base GPT-4 model",
    },
    {
      value: "gpt-3.5-turbo-0125",
      label: "GPT-3.5 Turbo (0125)",
      description: "Latest GPT-3.5 model",
    },
  ],
  anthropic: [
    {
      value: "claude-3-5-sonnet",
      label: "Claude 3.5 Sonnet",
      description: "Latest Claude model with enhanced capabilities",
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
      description: "Latest Llama 2 model",
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
      description: "Powerful mixture of experts model",
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
      description: "Efficient small language model",
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

export const embeddingModels = [
  {
    value: "text-embedding-3-large",
    label: "Text Embedding 3 Large",
    description: "Latest high-performance embedding model",
  },
  {
    value: "text-embedding-3-small",
    label: "Text Embedding 3 Small",
    description: "Cost-effective embedding model",
  },
  {
    value: "text-embedding-ada-002",
    label: "Text Embedding Ada 002",
    description: "Legacy embedding model",
  },
  {
    value: "llama2-embedding",
    label: "Llama 2 Embeddings",
    description: "Local Llama 2 embeddings via Ollama",
  },
  {
    value: "nomic-embed-text",
    label: "Nomic Embed",
    description: "Open source embeddings by Nomic AI",
  },
] as const;
