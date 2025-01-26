"use client";

import { Card } from "@/components/ui/card";
import { Brain, FileText, MessageSquare, Clock, Zap } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Overview of your Second Brain activity and insights
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Active Chats</span>
          </div>
          <p className="text-2xl font-bold">12</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-5 w-5 text-green-500" />
            <span className="font-medium">Documents</span>
          </div>
          <p className="text-2xl font-bold">47</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <span className="font-medium">Insights Generated</span>
          </div>
          <p className="text-2xl font-bold">156</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="font-medium">Time Saved</span>
          </div>
          <p className="text-2xl font-bold">23h</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Document Analysis Completed</p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Processed "Q4 Financial Report.pdf"
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-500">
                    2 hours ago
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Insights</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="font-medium">Key Finding</span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Revenue growth shows consistent 15% increase quarter over quarter,
                  primarily driven by expansion in European markets.
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
