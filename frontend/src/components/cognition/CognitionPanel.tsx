"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Brain, ChevronLeft, Circle } from "lucide-react";
import { useState } from "react";

interface LogEntry {
  timestamp: Date;
  message: string;
  type: "info" | "debug" | "error" | "thinking" | "metacognition";
  details?: string;
}

interface CognitionPanelProps {
  logs?: LogEntry[];
}

// Example logs for development
const baseTime = new Date('2025-01-25T22:00:00-07:00');
const exampleLogs: LogEntry[] = [
  {
    timestamp: baseTime,
    type: "metacognition",
    message: "Initiating cognitive framework",
    details: "Loading personal context and previous interaction patterns to optimize response strategy"
  },
  {
    timestamp: new Date(baseTime.getTime() + 1000), // add 1 second
    type: "thinking",
    message: "Analyzing user request about project management tools",
    details: "Breaking down request into key components: 1) Project management 2) Tool requirements 3) Integration needs"
  },
  {
    timestamp: new Date(baseTime.getTime() + 2000), // add 2 seconds
    type: "metacognition",
    message: "Adjusting response depth",
    details: "User's previous interactions show preference for detailed technical explanations"
  },
  {
    timestamp: new Date(baseTime.getTime() + 3000),
    type: "info",
    message: "Accessing knowledge base",
    details: "Searching through previous conversations and documentation about project management tools"
  },
  {
    timestamp: new Date(baseTime.getTime() + 4000),
    type: "debug",
    message: "Found relevant context",
    details: "User previously mentioned need for GitHub integration and team collaboration features"
  },
  {
    timestamp: new Date(baseTime.getTime() + 5000),
    type: "metacognition",
    message: "Detecting potential knowledge gaps",
    details: "Limited information about user's team size and budget constraints. Consider asking clarifying questions."
  },
  {
    timestamp: new Date(baseTime.getTime() + 6000),
    type: "thinking",
    message: "Evaluating tool options",
    details: "Comparing: Jira, Trello, Asana, ClickUp based on user's requirements"
  },
  {
    timestamp: new Date(baseTime.getTime() + 7000),
    type: "metacognition",
    message: "Prioritizing response elements",
    details: "Emphasizing GitHub integration capabilities based on user's development focus"
  },
  {
    timestamp: new Date(baseTime.getTime() + 8000),
    type: "info",
    message: "Checking integration capabilities",
    details: "Verifying API documentation and GitHub integration support for each tool"
  }
];

export function CognitionPanel({ logs = exampleLogs }: CognitionPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getIconForType = (type: LogEntry['type']) => {
    switch (type) {
      case 'thinking':
        return <Brain className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'metacognition':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'info':
        return <Circle className="h-4 w-4 text-green-500" />;
      case 'debug':
        return <Circle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <Circle className="h-4 w-4 text-red-500" />;
    }
  };

  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="hover:bg-accent rounded-full transition-transform duration-200"
        >
          <ChevronLeft className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="right" 
        className="w-[400px] sm:w-[540px] bg-background border-l"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            System Cognition
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4 overflow-y-auto max-h-[calc(100vh-8rem)]">
          {logs.map((log, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-start gap-2">
                {getIconForType(log.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{log.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                  {log.details && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {log.details}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
