import React, { useEffect } from 'react';
import { X, Command } from 'lucide-react';
import { SearchBar } from './SearchBar';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          document.getElementById('search-trigger')?.click();
        }
      }

      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 animate-in fade-in-0">
      <div className="fixed inset-x-0 top-0 bg-white p-4 shadow-lg animate-in slide-in-from-top">
        <div className="container mx-auto flex items-center gap-4">
          <div className="flex-1">
            <SearchBar 
              placeholder="Telefon modeli ara..."
              onResultClick={onClose}
            />
          </div>
          <div className="flex items-center gap-2">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-600">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}