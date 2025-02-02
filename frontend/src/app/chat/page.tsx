'use client';

import { useState } from "react";
import { Message } from "@/types/chat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";

const initialMessages: Message[] = [
  {
    id: "1",
    content: "Hello! How can I help you today?",
    role: "assistant",
    sender: "AI Assistant",
    timestamp: new Date(),
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      sender: "You",
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
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

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            // Handle the first message
            if (!systemMessageId) {
              systemMessageId = data.id;
              setMessages(prev => [...prev, {
                id: systemMessageId,
                content: data.content,
                role: 'assistant',
                sender: 'AI Assistant',
                timestamp: new Date(data.timestamp)
              }]);
              continue;
            }

            // Update existing message
            setMessages(prev => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage.id === systemMessageId) {
                return [
                  ...prev.slice(0, -1),
                  {
                    ...lastMessage,
                    content: data.content
                  }
                ];
              }
              return prev;
            });

            if (data.done) {
              systemMessageId = '';
            }
          } catch (e) {
            console.error('Error parsing stream data:', e);
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "system",
        sender: "System",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 flex flex-col">
        <ChatWindow messages={messages} isStreaming={isProcessing} />
        <ChatInput onSendMessage={handleSendMessage} disabled={isProcessing} />
      </div>
    </div>
  );
}
