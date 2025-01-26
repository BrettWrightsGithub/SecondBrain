'use client';

import { useState } from "react";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ChatInput } from "@/components/chat/ChatInput";
import { CognitionPanel } from "@/components/cognition/CognitionPanel";
import { MetacognitionSidebar } from "@/components/metacognition/MetacognitionSidebar"; // Import MetacognitionSidebar
import type { Message } from "@/types/chat";

// Mock data for initial development
const initialMessages = [
  {
    id: "1",
    content: "Hello! How can I help you today?",
    sender: "system" as const,
    timestamp: new Date(),
  },
];

const initialLogs = [
  {
    timestamp: new Date(),
    message: "System initialized",
    type: "info" as const,
  },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [logs, setLogs] = useState(initialLogs);
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
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
                sender: 'system',
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
        sender: "system",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      // Add error log
      setLogs((prev) => [...prev, {
        timestamp: new Date(),
        message: error instanceof Error ? error.message : 'Unknown error',
        type: 'error' as const,
      }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleFileUpload = (files: FileList) => {
    // TODO: Implement file upload with ClamAV scanning
    Array.from(files).forEach(file => {
      console.log("File to be uploaded:", file.name);
      // Add a message about the uploaded file
      const message: Message = {
        id: Date.now().toString(),
        content: `📄 Uploaded document: **${file.name}**\n\nProcessing...`,
        sender: "system",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, message]);
    });
  };

  return (
    <div className="flex h-screen">
      {/* Main chat container */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="py-4 border-b flex justify-between items-center px-8">
          <h1 className="text-2xl font-bold">Your Second Brain</h1>
        </header>

        {/* Main chat area with max width and center alignment */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-8 h-full">
            <ChatWindow messages={messages} isStreaming={isStreaming} />
          </div>
        </div>

        {/* Input area with max width and center alignment */}
        <div className="px-8 pb-6">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>

      {/* Metacognition Panel */}
      <div className="flex-shrink-0">
        <MetacognitionSidebar />
      </div>
    </div>
  );
}
