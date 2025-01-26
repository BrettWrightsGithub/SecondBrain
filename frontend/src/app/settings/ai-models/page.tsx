"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useSettings } from "@/lib/stores/settings";
import type { ChatModelType, EmbeddingModelType, ModelProvider } from "@/lib/stores/settings";
import { OllamaSetup } from "./ollama-setup";
import { chatModels, embeddingModels } from "./models";
import { ErrorBoundary } from "@/components/error-boundary";

const providers = [
  {
    value: "openai",
    label: "OpenAI",
    description: "GPT-4 and GPT-3.5 models",
  },
  {
    value: "anthropic",
    label: "Anthropic",
    description: "Claude models",
  },
  {
    value: "ollama",
    label: "Ollama",
    description: "Local models including Llama 2",
  },
] as const;

export default function AIModelsPage() {
  const { aiModels, updateAIModels } = useSettings();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">AI Models</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Configure AI model settings and parameters
        </p>
      </div>

      <ErrorBoundary>
        <div className="space-y-6">
          {/* Provider Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Model Provider</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Provider</Label>
                <Select 
                  value={aiModels.provider.type}
                  onValueChange={(value: ModelProvider['type']) => {
                    // When changing provider, also update to a default model for that provider
                    const defaultModel = chatModels[value][0].value as ChatModelType;
                    updateAIModels({ 
                      provider: { type: value },
                      chatModel: defaultModel,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((provider) => (
                      <SelectItem key={provider.value} value={provider.value}>
                        <div>
                          <div className="font-medium">{provider.label}</div>
                          <div className="text-sm text-neutral-500">{provider.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provider-specific settings */}
              {aiModels.provider.type === 'ollama' && (
                <div className="grid gap-2">
                  <Label>Ollama Base URL</Label>
                  <Input
                    placeholder="http://localhost:11434"
                    value={aiModels.provider.baseUrl || ''}
                    onChange={(e) => updateAIModels({ 
                      provider: { baseUrl: e.target.value } 
                    })}
                  />
                  <p className="text-sm text-neutral-500">URL where Ollama is running</p>
                </div>
              )}

              {(aiModels.provider.type === 'openai' || aiModels.provider.type === 'anthropic') && (
                <div className="grid gap-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    placeholder="Enter your API key"
                    value={aiModels.provider.apiKey || ''}
                    onChange={(e) => updateAIModels({ 
                      provider: { apiKey: e.target.value } 
                    })}
                  />
                  <p className="text-sm text-neutral-500">
                    {aiModels.provider.type === 'openai' 
                      ? 'Your OpenAI API key'
                      : 'Your Anthropic API key'
                    }
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Ollama Setup */}
          {aiModels.provider.type === 'ollama' && <OllamaSetup />}

          {/* Model Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Model Selection</h2>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="chat-model">Chat Model</Label>
                <Select 
                  value={aiModels.chatModel}
                  onValueChange={(value: ChatModelType) => updateAIModels({ chatModel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {chatModels[aiModels.provider.type].map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-sm text-neutral-500">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-neutral-500">Model used for chat interactions</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="embedding-model">Embedding Model</Label>
                <Select 
                  value={aiModels.embeddingModel}
                  onValueChange={(value: EmbeddingModelType) => updateAIModels({ embeddingModel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {embeddingModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-sm text-neutral-500">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-neutral-500">Model used for document embeddings</p>
              </div>
            </div>
          </Card>

          {/* Model Parameters */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Model Parameters</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm text-neutral-500">{aiModels.temperature}</span>
                </div>
                <Slider
                  value={[aiModels.temperature]}
                  onValueChange={([value]) => updateAIModels({ temperature: value })}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-sm text-neutral-500">Controls randomness in the model's responses</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Max Tokens</Label>
                  <span className="text-sm text-neutral-500">{aiModels.maxTokens}</span>
                </div>
                <Slider
                  value={[aiModels.maxTokens]}
                  onValueChange={([value]) => updateAIModels({ maxTokens: value })}
                  max={4096}
                  step={256}
                  className="w-full"
                />
                <p className="text-sm text-neutral-500">Maximum length of the model's responses</p>
              </div>
            </div>
          </Card>

          {/* Advanced Settings */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Advanced Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Stream Responses</Label>
                  <p className="text-sm text-neutral-500">Show responses as they are generated</p>
                </div>
                <Switch 
                  checked={aiModels.streamResponses}
                  onCheckedChange={(checked) => updateAIModels({ streamResponses: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Use Context Window</Label>
                  <p className="text-sm text-neutral-500">Include previous messages as context</p>
                </div>
                <Switch 
                  checked={aiModels.useContextWindow}
                  onCheckedChange={(checked) => updateAIModels({ useContextWindow: checked })}
                />
              </div>
            </div>
          </Card>
        </div>
      </ErrorBoundary>
    </div>
  );
}
