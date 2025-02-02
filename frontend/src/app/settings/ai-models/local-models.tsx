import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";

interface LocalModel {
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

export default function LocalModels() {
  const [models, setModels] = useState<LocalModel[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLocalModels = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/ollama/local-models');
      if (!response.ok) {
        throw new Error('Failed to fetch local models');
      }
      const data = await response.json();
      setModels(data.models);
    } catch (error) {
      console.error('Error fetching local models:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatSize = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Local Models</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchLocalModels}
          disabled={loading}
        >
          {loading ? (
            <>
              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <ReloadIcon className="mr-2 h-4 w-4" />
              Refresh
            </>
          )}
        </Button>
      </div>
      
      {models.length > 0 ? (
        <div className="space-y-4">
          {models.map((model) => (
            <div
              key={model.name}
              className="border rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{model.name}</h3>
                  <p className="text-sm text-neutral-500">
                    Family: {model.details.family} • Size: {formatSize(model.size)}
                  </p>
                  <p className="text-sm text-neutral-500">
                    Parameters: {model.details.parameter_size} • Format: {model.details.format}
                  </p>
                </div>
                <div className="text-sm text-neutral-500">
                  {new Date(model.modifiedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-neutral-500 text-center py-4">
          Click refresh to see available local models
        </p>
      )}
    </Card>
  );
}
