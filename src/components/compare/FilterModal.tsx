import React from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function FilterModal({ isOpen, onClose, title, children }: FilterModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 animate-in slide-in-from-bottom">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button
          onClick={onClose}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Geri</span>
        </button>
        <h2 className="font-medium">{title}</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
        {children}
      </div>
    </div>
  );
}