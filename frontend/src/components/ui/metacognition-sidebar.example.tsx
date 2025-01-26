"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { Brain, Lightbulb, History, Settings } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MetacognitionSidebar() {
  const links = [
    {
      label: "Thoughts",
      href: "#",
      icon: (
        <Brain className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Insights",
      href: "#",
      icon: (
        <Lightbulb className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "History",
      href: "#",
      icon: (
        <History className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 h-full border-l border-neutral-200 dark:border-neutral-700 overflow-hidden"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Metacognition
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <MetacognitionContent />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Second Brain
      </motion.span>
    </Link>
  );
};

// Placeholder content component
const MetacognitionContent = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-6 rounded-tl-2xl bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex flex-col gap-4">
          <div className="h-24 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4">
            <h3 className="text-lg font-semibold mb-2">Current Thoughts</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              AI is analyzing the conversation...
            </p>
          </div>
          <div className="h-24 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 p-4">
            <h3 className="text-lg font-semibold mb-2">Key Insights</h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              No insights generated yet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
