'use client';

import { useState } from "react";
import { Message } from "@/types/chat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";
import { PrivacyToggle } from "@/components/chat/PrivacyToggle";
import { useSettings } from "@/lib/stores/settings";
import { useChatStore } from "@/lib/stores/chat";

export default function ChatPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const { aiModels } = useSettings();
  const { messages, isPrivate, addMessage, updateLastMessage, setIsPrivate } = useChatStore();

  const getModelConfig = () => {
    if (aiModels.provider.type === 'ollama') {
      return {
        model: aiModels.chatModel,  // Use the selected model directly
        provider: {
          type: 'ollama',
          baseUrl: aiModels.provider.baseUrl || 'http://127.0.0.1:11434'
        }
      };
    } else {
      // For OpenAI, use the selected model
      return {
        model: aiModels.chatModel,
        provider: {
          type: 'openai',
        },
        temperature: aiModels.temperature,
        maxTokens: aiModels.maxTokens,
      };
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      sender: "You",
      timestamp: new Date(),
    };

    addMessage(userMessage);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: content
          }],
          modelConfig: getModelConfig(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let systemMessageId = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last line in the buffer if it's incomplete
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

          try {
            const jsonStr = trimmedLine.slice(6); // Remove 'data: ' prefix
            const data = JSON.parse(jsonStr);
            
            // Handle the first message
            if (!systemMessageId) {
              systemMessageId = data.id;
              const assistantMessage: Message = {
                id: systemMessageId,
                content: data.content,
                role: 'assistant',
                sender: aiModels.provider.type === 'ollama' ? 'AI Assistant (Private)' : 'AI Assistant',
                timestamp: new Date()
              };
              addMessage(assistantMessage);
              continue;
            }

            // Update existing message
            updateLastMessage(data.content);

            if (data.done) {
              systemMessageId = '';
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
            console.log('Problematic line:', line);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, there was an error processing your message.",
        role: "assistant",
        sender: aiModels.provider.type === 'ollama' ? 'AI Assistant (Private)' : 'AI Assistant',
        timestamp: new Date(),
      };
      addMessage(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end p-4">
        <PrivacyToggle isPrivate={aiModels.provider.type === 'ollama'} onToggle={() => setIsPrivate(aiModels.provider.type === 'ollama')} />
      </div>
      <ChatWindow messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} disabled={isProcessing} />
    </div>
  );
}
