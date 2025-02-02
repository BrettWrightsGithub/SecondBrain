"use client"

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

export function OllamaTest() {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'connected' | 'error'>('idle');

    const checkHealth = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/ollama/health');
            if (res.ok) {
                setStatus('connected');
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const res = await fetch('http://localhost:3001/api/ollama/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setResponse(data.response);
        } catch (error) {
            console.error('Error:', error);
            setResponse('Error generating response');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 max-w-2xl mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Ollama Test</h2>
            
            <div className="mb-4">
                <Button 
                    onClick={checkHealth}
                    variant={status === 'connected' ? 'default' : 'secondary'}
                >
                    {status === 'idle' ? 'Check Connection' :
                     status === 'connected' ? 'Connected' : 'Connection Error'}
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                    <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter your prompt..."
                        disabled={loading}
                    />
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Generating...' : 'Send'}
                    </Button>
                </div>
            </form>

            {response && (
                <div className="mt-4">
                    <h3 className="font-semibold mb-2">Response:</h3>
                    <p className="whitespace-pre-wrap">{response}</p>
                </div>
            )}
        </Card>
    );
}
