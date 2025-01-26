"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Preferences {
  notificationLevel: "all" | "urgent" | "none";
  modelPreference: "gpt4" | "mixtral" | "local";
  privacyLevel: "standard" | "high" | "maximum";
  autoSave: boolean;
  responseLength: number;
  customInstructions: string;
  documentRetention: number; // in days
}

export default function PreferencesPage() {
  const [preferences, setPreferences] = useState<Preferences>({
    notificationLevel: "urgent",
    modelPreference: "gpt4",
    privacyLevel: "standard",
    autoSave: true,
    responseLength: 250,
    customInstructions: "",
    documentRetention: 30,
  });

  const handleSave = async () => {
    // TODO: Add API call to save preferences
    console.log("Saving preferences:", preferences);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Values & Preferences</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize how Your Second Brain works for you. These settings help the system understand your preferences and constraints.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notification Preferences */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Notification Level</Label>
              <Select
                value={preferences.notificationLevel}
                onValueChange={(value: "all" | "urgent" | "none") =>
                  setPreferences({ ...preferences, notificationLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Updates</SelectItem>
                  <SelectItem value="urgent">Urgent Only</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* AI Model Preferences */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">AI Model Preferences</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Preferred Model</Label>
              <Select
                value={preferences.modelPreference}
                onValueChange={(value: "gpt4" | "mixtral" | "local") =>
                  setPreferences({ ...preferences, modelPreference: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt4">GPT-4 (Most Capable)</SelectItem>
                  <SelectItem value="mixtral">Mixtral (Balanced)</SelectItem>
                  <SelectItem value="local">Local Model (Most Private)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Response Length (words)</Label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[preferences.responseLength]}
                  onValueChange={([value]) =>
                    setPreferences({ ...preferences, responseLength: value })
                  }
                  max={500}
                  step={50}
                  className="flex-1"
                />
                <span className="text-sm text-neutral-600 dark:text-neutral-400 w-12">
                  {preferences.responseLength}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Privacy & Security</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Privacy Level</Label>
              <Select
                value={preferences.privacyLevel}
                onValueChange={(value: "standard" | "high" | "maximum") =>
                  setPreferences({ ...preferences, privacyLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="maximum">Maximum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Document Retention (days)</Label>
              <Input
                type="number"
                value={preferences.documentRetention}
                onChange={(e) =>
                  setPreferences({
                    ...preferences,
                    documentRetention: parseInt(e.target.value) || 30,
                  })
                }
                min={1}
                max={365}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label>Auto-save conversations</Label>
              <Switch
                checked={preferences.autoSave}
                onCheckedChange={(checked) =>
                  setPreferences({ ...preferences, autoSave: checked })
                }
              />
            </div>
          </div>
        </Card>

        {/* Custom Instructions */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Custom Instructions</h2>
          <div className="space-y-2">
            <Label>Additional Instructions for Your Second Brain</Label>
            <Textarea
              value={preferences.customInstructions}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  customInstructions: e.target.value,
                })
              }
              placeholder="Add any specific instructions or preferences you'd like the system to follow..."
              className="h-32"
            />
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
