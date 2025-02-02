"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ollamaApi } from '../../api/ollama';
import type { OllamaModel, OllamaSettings } from '../../types/ollama';

interface FormData extends OllamaSettings {
    selectedModel: string;
    baseUrl: string;
}

export function OllamaSettings() {
    const [models, setModels] = useState<OllamaModel[]>([]);
    const [settings, setSettings] = useState<FormData>({
        selectedModel: '',
        baseUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [health, setHealth] = useState<boolean>(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [modelsData, settingsData, healthStatus] = await Promise.all([
                ollamaApi.getModels(),
                ollamaApi.getSettings(),
                ollamaApi.getHealth()
            ]);
            setModels(modelsData);
            setSettings(settingsData);
            setHealth(healthStatus);
            setError(null);
        } catch (err) {
            setError('Failed to load settings');
            console.error('Error loading settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await ollamaApi.updateSettings(settings);
            setSuccess('Settings saved successfully');
            setError(null);
            await loadData();
        } catch (err) {
            setError('Failed to save settings');
            console.error('Error saving settings:', err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Ollama Settings</CardTitle>
                <CardDescription>Configure your local Ollama instance settings</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading settings...</span>
                    </div>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-4 py-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label>Base URL</Label>
                        <Input
                            type="text"
                            value={settings.baseUrl}
                            onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                            placeholder="http://localhost:11434"
                        />
                    </div>

                    <div className="grid w-full items-center gap-1.5">
                        <Label>Model</Label>
                        <Select onValueChange={(value) => setSettings({ ...settings, selectedModel: value })} value={settings.selectedModel}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a model" />
                            </SelectTrigger>
                            <SelectContent>
                                {models.map((model) => (
                                    <SelectItem key={model.name} value={model.name}>
                                        {model.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex justify-end space-x-2">
                    <Button
                        onClick={handleSave}
                        disabled={loading || saving}
                    >
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
