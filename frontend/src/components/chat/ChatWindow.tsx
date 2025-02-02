"use client";

import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Message } from "@/types/chat";

interface ChatWindowProps {
  messages: Message[];
  isStreaming?: boolean;
}

export function ChatWindow({ messages, isStreaming }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const components = {
    code({ inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || "");
      return (
        <code
          className={cn(
            !inline && "block bg-neutral-900 text-neutral-50 p-4 rounded overflow-x-auto",
            className
          )}
          {...props}
        >
          {children}
        </code>
      );
    },
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto py-6 gap-6 px-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex gap-4 items-start",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                AI
              </AvatarFallback>
            </Avatar>
          )}

          <div
            className={cn(
              "rounded-lg px-4 py-2 max-w-[85%] break-words",
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={components}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {message.role === "user" && (
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                You
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      ))}
      {isStreaming && (
        <div className="flex justify-center">
          <div className="loading-dots">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
