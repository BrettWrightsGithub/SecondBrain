'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  MessageSquare, 
  Settings, 
  FileText, 
  History,
  LayoutDashboard
} from 'lucide-react';

const menuItems = [
  { href: '/chat', icon: MessageSquare, label: 'Chat' },
  { href: '/documents', icon: FileText, label: 'Documents' },
  { href: '/history', icon: History, label: 'History' },
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export function Menu() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-4">
        {menuItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`p-3 rounded-full hover:bg-gray-100 transition-colors duration-200 group relative
                ${isActive ? 'bg-gray-100' : ''}`}
            >
              <Icon 
                className={`w-6 h-6 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} 
              />
              <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-2 py-1 rounded 
                opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm whitespace-nowrap">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
