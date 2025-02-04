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
    <div className="fixed left-0 top-0 bottom-0 z-50">
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden md:flex h-screen flex-col bg-background/50 backdrop-blur-sm"
        animate={{
          width: open ? "240px" : "64px",
        }}
      >
        <div className="p-4 mb-4">
          <MenuButton open={open} setOpen={setOpen} />
        </div>

        <nav className="flex flex-col gap-4 px-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 text-sm rounded-lg transition-all hover:scale-105",
                  isActive
                    ? "bg-white/90 shadow-lg text-primary dark:bg-neutral-800/90 dark:text-primary-foreground"
                    : "text-muted-foreground hover:bg-white/90 hover:shadow-lg dark:hover:bg-neutral-800/90 hover:text-primary"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0 transition-transform" />
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
      <div className="block md:hidden fixed top-4 left-4 z-50">
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
