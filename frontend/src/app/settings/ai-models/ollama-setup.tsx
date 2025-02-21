"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSettings } from "@/lib/stores/settings";
import { OllamaService, type OllamaModel } from "@/lib/services/ollama";
import { Loader2, CheckCircle2, XCircle, Download, Trash, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { chatModels } from "./models";
import { ErrorBoundary } from "@/components/error-boundary";

interface ModelStatus {
  [key: string]: {
    status: 'downloading' | 'ready' | 'error';
    progress?: number;
  };
}

export default function OllamaSetup() {
  const { aiModels } = useSettings();
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [installedModels, setInstalledModels] = useState<OllamaModel[]>([]);
  const [modelStatus, setModelStatus] = useState<ModelStatus>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const ollamaService = new OllamaService(aiModels.provider.baseUrl);

  useEffect(() => {
    checkConnection();
  }, [aiModels.provider.baseUrl]);

  const checkConnection = async () => {
    try {
      const connected = await ollamaService.checkConnection();
      setIsConnected(connected);
      if (connected) {
        refreshModels();
      }
    } catch (error) {
      setIsConnected(false);
      console.error('Failed to connect to Ollama:', error);
    }
  };

  const refreshModels = async () => {
    setIsRefreshing(true);
    try {
      const models = await ollamaService.listModels();
      setInstalledModels(models);
      
      // Update status for installed models
      const newStatus: ModelStatus = {};
      models.forEach(model => {
        newStatus[model.name] = { status: 'ready' };
      });
      setModelStatus(newStatus);
      
      toast({
        title: "Success",
        description: "Successfully refreshed model list",
      });
    } catch (error) {
      console.error('Failed to list models:', error);
      toast({
        title: "Error",
        description: "Failed to list installed models",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    checkConnection();
  };

  const installModel = async (modelName: string) => {
    try {
      setModelStatus(prev => ({
        ...prev,
        [modelName]: { status: 'downloading', progress: 0 },
      }));

      await ollamaService.pullModel(modelName, (status) => {
        if (status.total && status.completed) {
          const progress = (status.completed / status.total) * 100;
          setModelStatus(prev => ({
            ...prev,
            [modelName]: { status: 'downloading', progress },
          }));
        }
      });

      setModelStatus(prev => ({
        ...prev,
        [modelName]: { status: 'ready' },
      }));

      await refreshModels();
      
      toast({
        title: "Success",
        description: `Successfully installed ${modelName}`,
      });
    } catch (error) {
      console.error('Failed to install model:', error);
      setModelStatus(prev => ({
        ...prev,
        [modelName]: { status: 'error' },
      }));
      toast({
        title: "Error",
        description: `Failed to install ${modelName}`,
        variant: "destructive",
      });
    }
  };

  const deleteModel = async (modelName: string) => {
    try {
      await ollamaService.deleteModel(modelName);
      await refreshModels();
      toast({
        title: "Success",
        description: `Successfully deleted ${modelName}`,
      });
    } catch (error) {
      console.error('Failed to delete model:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${modelName}`,
        variant: "destructive",
      });
    }
  };

  if (!aiModels.provider.baseUrl) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold mb-2">Ollama URL Not Configured</h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Please configure the Ollama base URL in the provider settings above.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Ollama Status</h3>
            {isConnected === null ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isConnected ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        <div className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(chatModels.ollama).map(([_, model]) => {
              const isInstalled = installedModels.some(m => m.name === model.value);
              const status = modelStatus[model.value];

              return (
                <div
                  key={model.value}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{model.label}</h4>
                    <p className="text-sm text-muted-foreground">
                      {model.description}
                    </p>
                    {status?.status === 'downloading' && status.progress && (
                      <Progress value={status.progress} className="mt-2" />
                    )}
                  </div>
                  <div className="ml-4">
                    {isInstalled ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteModel(model.value)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => installModel(model.value)}
                        disabled={status?.status === 'downloading'}
                      >
                        {status?.status === 'downloading' ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </ErrorBoundary>
  );
}
