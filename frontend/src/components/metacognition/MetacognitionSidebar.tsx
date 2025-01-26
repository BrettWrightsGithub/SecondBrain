"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import { Lightbulb, History, MessageSquare, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ThoughtItem {
  icon: React.ReactNode;
  title: string;
  content: string;
}

export function MetacognitionSidebar() {
  const thoughts: ThoughtItem[] = [
    {
      icon: <Lightbulb className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      title: "Current Focus",
      content: "Analyzing conversation patterns and user intent...",
    },
    {
      icon: <Lightbulb className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      title: "Key Insights",
      content: "User is working on improving chat interface responsiveness",
    },
    {
      icon: <History className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      title: "Recent Changes",
      content: "Modified message streaming, updated UI components",
    },
    {
      icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />,
      title: "Suggestions",
      content: "Consider adding typing indicators and message timestamps",
    },
  ];
  
  const [open, setOpen] = useState(false);
  
  return (
    <div className="h-full flex">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody>
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex items-center gap-2 mb-6">
              <ChevronLeft 
                className={cn(
                  "h-6 w-6 text-neutral-800 dark:text-neutral-200 cursor-pointer transition-transform",
                  open ? "rotate-180" : ""
                )}
                onClick={() => setOpen(!open)}
              />
              <motion.span
                animate={{
                  opacity: open ? 1 : 0,
                  display: open ? "block" : "none",
                }}
                className="font-semibold text-neutral-800 dark:text-neutral-200"
              >
                Metacognition
              </motion.span>
            </div>
            
            <div className="flex flex-col gap-6">
              {thoughts.map((thought, idx) => (
                <div key={idx} className="flex gap-3">
                  {thought.icon}
                  <motion.div
                    animate={{
                      opacity: open ? 1 : 0,
                      display: open ? "block" : "none",
                    }}
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-medium text-sm text-neutral-800 dark:text-neutral-200 mb-1">
                      {thought.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {thought.content}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}
