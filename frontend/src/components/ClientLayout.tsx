"use client"

import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/chat/Header";
import { NavSidebar } from "@/components/navigation/nav-sidebar";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={cn(
      "min-h-screen bg-background font-sans antialiased",
    )}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Header />
        <div className="flex h-[calc(100vh-4rem)] pt-16">
          <NavSidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}
