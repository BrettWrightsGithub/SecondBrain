"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  FileText,
  Brain,
  Calendar,
  ChevronDown,
  Filter,
} from "lucide-react";

const activities = [
  {
    type: "chat",
    title: "Chat Session",
    description: "Discussed Q4 financial analysis",
    time: "2 hours ago",
    icon: MessageSquare,
    iconColor: "text-blue-500",
  },
  {
    type: "document",
    title: "Document Upload",
    description: "Added 'Q4 Financial Report.pdf'",
    time: "3 hours ago",
    icon: FileText,
    iconColor: "text-green-500",
  },
  {
    type: "insight",
    title: "New Insight",
    description: "Generated key findings from financial data",
    time: "4 hours ago",
    icon: Brain,
    iconColor: "text-purple-500",
  },
  // Repeat with different times
  {
    type: "chat",
    title: "Chat Session",
    description: "Reviewed marketing strategy",
    time: "1 day ago",
    icon: MessageSquare,
    iconColor: "text-blue-500",
  },
  {
    type: "document",
    title: "Document Upload",
    description: "Added 'Marketing Plan 2024.docx'",
    time: "1 day ago",
    icon: FileText,
    iconColor: "text-green-500",
  },
];

export default function HistoryPage() {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Activity History</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Track your interactions and generated insights
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Time Range
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Activity Type
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />
        
        <div className="space-y-6">
          {activities.map((activity, i) => {
            const Icon = activity.icon;
            return (
              <div key={i} className="relative flex gap-4 items-start ml-8">
                <div className="absolute -left-8 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800" />
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  activity.type === "chat" ? "bg-blue-100 dark:bg-blue-900/20" :
                  activity.type === "document" ? "bg-green-100 dark:bg-green-900/20" :
                  "bg-purple-100 dark:bg-purple-900/20"
                )}>
                  <Icon className={cn("h-4 w-4", activity.iconColor)} />
                </div>
                <Card className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium">{activity.title}</h3>
                    <span className="text-sm text-neutral-500">{activity.time}</span>
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {activity.description}
                  </p>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <Button variant="outline">Load More</Button>
        </div>
      </div>
    </div>
  );
}
