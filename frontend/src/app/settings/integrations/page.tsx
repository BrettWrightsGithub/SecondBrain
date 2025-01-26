"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  apiKey?: string;
  status: "configured" | "not_configured" | "error";
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT-4 and other OpenAI models for advanced language processing",
      isEnabled: true,
      status: "configured",
    },
    {
      id: "groq",
      name: "Groq",
      description: "Ultra-fast inference for language models",
      isEnabled: false,
      status: "not_configured",
    },
    {
      id: "clamav",
      name: "ClamAV",
      description: "Antivirus scanning for uploaded files",
      isEnabled: true,
      status: "configured",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [newApiKey, setNewApiKey] = useState("");

  const handleToggle = (id: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, isEnabled: !integration.isEnabled }
        : integration
    ));
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setNewApiKey("");
  };

  const handleSave = async (id: string) => {
    // TODO: Add API call to save the key securely
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { ...integration, status: "configured" }
        : integration
    ));
    setEditingId(null);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Integrations & API Keys</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your external service integrations and API keys. All credentials are stored securely.
        </p>
      </div>

      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-semibold">{integration.name}</h2>
                  {integration.status === "configured" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : integration.status === "error" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : null}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  {integration.description}
                </p>
                
                {editingId === integration.id ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${integration.id}-api-key`}>API Key</Label>
                      <Input
                        id={`${integration.id}-api-key`}
                        type="password"
                        value={newApiKey}
                        onChange={(e) => setNewApiKey(e.target.value)}
                        placeholder="Enter your API key"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleSave(integration.id)}>
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => handleEdit(integration.id)}
                  >
                    {integration.status === "configured"
                      ? "Update API Key"
                      : "Add API Key"}
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  checked={integration.isEnabled}
                  onCheckedChange={() => handleToggle(integration.id)}
                />
                <Label>{integration.isEnabled ? "Enabled" : "Disabled"}</Label>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
