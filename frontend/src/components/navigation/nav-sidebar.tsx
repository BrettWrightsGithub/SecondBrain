"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MenuButton } from "@/components/ui/menu-button";
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  History,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Chat",
    href: "/chat",
    icon: MessageSquare,
  },
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function NavSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="relative">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex h-screen flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
        animate={{
          width: open ? "240px" : "64px",
        }}
      >
        <div className="p-4">
          <MenuButton open={open} setOpen={setOpen} />
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <motion.span
                  animate={{
                    opacity: open ? 1 : 0,
                    display: open ? "block" : "none",
                  }}
                >
                  {item.name}
                </motion.span>
              </Link>
            );
          })}
        </nav>
      </motion.div>

      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <div className="p-4">
          <MenuButton open={open} setOpen={setOpen} />
        </div>

        {/* Mobile menu overlay */}
        {open && (
          <>
            <div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-neutral-900 shadow-lg z-50"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="p-4">
                <MenuButton open={open} setOpen={setOpen} />
              </div>

              <nav className="flex-1 space-y-1 px-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                        isActive
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                          : "text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-800/50"
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
