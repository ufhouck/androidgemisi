import React, { useEffect } from 'react';
import { X, Command, Filter } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import { cn } from '../../lib/utils';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const navigate = useNavigate();
  const { popularBrands, popularFilters } = useSearch();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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

  const handleBrandClick = (brandId: string) => {
    navigate(`/karsilastir?brand=${brandId}`);
    onClose();
  };

  const handleFilterClick = (filter: { key: string; value: string }) => {
    navigate(`/karsilastir?${filter.key}=${filter.value}`);
    onClose();
  };

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

        <div className="container mx-auto mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Popular Brands */}
            <div>
              <h3 className={cn(
                "font-medium text-gray-400 mb-2",
                isMobile ? "text-[10px]" : "text-xs"
              )}>POPÜLER MARKALAR</h3>
              <div className="flex flex-wrap gap-2">
                {popularBrands.map(brand => (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandClick(brand.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors",
                      isMobile ? "text-xs" : "text-sm"
                    )}
                  >
                    {brand.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Filters */}
            <div>
              <h3 className={cn(
                "font-medium text-gray-400 mb-2",
                isMobile ? "text-[10px]" : "text-xs"
              )}>POPÜLER FİLTRELER</h3>
              <div className="flex flex-wrap gap-2">
                {popularFilters.map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => handleFilterClick(filter.filter)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors",
                      isMobile ? "text-xs" : "text-sm"
                    )}
                  >
                    <Filter className={cn(
                      "text-gray-400",
                      isMobile ? "h-3 w-3" : "h-4 w-4"
                    )} />
                    {filter.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}