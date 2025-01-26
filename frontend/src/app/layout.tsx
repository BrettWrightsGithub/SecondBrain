import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/chat/Header";
import { NavSidebar } from "@/components/navigation/nav-sidebar";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Second Brain",
  description: "Your AI-powered second brain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Header />
        <div className="flex">
          <NavSidebar />
          <main className="flex-1 pt-16 transition-[margin] duration-300 ease-in-out data-[state=open]:mr-[400px] sm:data-[state=open]:mr-[540px]">
            {children}
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
