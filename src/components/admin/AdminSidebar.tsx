import React from 'react';
import { LayoutDashboard, Smartphone, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AdminSidebarProps {
  activeSection: 'dashboard' | 'phones' | 'reviews';
  onSectionChange: (section: 'dashboard' | 'phones' | 'reviews') => void;
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'phones', label: 'Telefonlar', icon: Smartphone },
    { id: 'reviews', label: 'Yorumlar', icon: MessageSquare },
  ] as const;

  return (
    <aside className="w-64 bg-white border-r min-h-[calc(100vh-64px)]">
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  activeSection === item.id
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}