import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Star, MessageSquare } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSearch } from '../../hooks/useSearch';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  placeholderClassName?: string;
  onResultClick?: () => void;
}

export function SearchBar({ 
  className, 
  placeholder = "Telefon modeli ara...", 
  placeholderClassName,
  onResultClick 
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const { query, setQuery, results, isLoading, popularSearches } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
        setFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleResultClick = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setQuery(name);
    setShowResults(false);
    setFocused(false);
    navigate(`/telefon/${slug}`);
    onResultClick?.();
  };

  const handleFocus = () => {
    setFocused(true);
    setShowResults(true);
    if (isMobile) {
      inputRef.current?.focus();
      window.scrollTo(0, 0);
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div 
        className={cn(
          "flex items-center gap-3 bg-white rounded-full transition-all duration-200 cursor-text",
          focused 
            ? "shadow-[0_3px_10px_rgb(0,0,0,0.1)] border-transparent" 
            : "border border-gray-200 hover:border-gray-300",
          isMobile ? "px-4 py-2.5" : "px-5 py-3.5"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <Search className={cn(
          "h-5 w-5",
          focused ? "text-gray-600" : "text-gray-400"
        )} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-400"
          placeholder={placeholder}
          onFocus={handleFocus}
        />

        {!isMobile && !focused && (
          <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-gray-50 px-2 font-mono text-[10px] font-medium text-gray-500">
            <span className="text-xs">⌘</span>K
          </kbd>
        )}

        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
      </div>

      {showResults && (
        <div className={cn(
          "absolute left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 divide-y divide-gray-100",
          isMobile ? "top-[calc(100%+0.5rem)] max-h-[70vh]" : "top-full mt-2 max-h-[60vh]",
          "overflow-y-auto overscroll-contain"
        )}>
          {results.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {results.map((result) => (
                <button
                  key={result.id}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => handleResultClick(result.name)}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-gray-600">{result.specs.processor}</p>
                    </div>
                    <span className="text-orange-600 font-semibold text-sm">
                      {result.price.tr}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{result.reviews.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{result.reviews.count} yorum</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <p>Sonuç bulunamadı</p>
              <p className="text-sm mt-1">Farklı bir arama yapmayı deneyin</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="text-xs font-medium text-gray-400 mb-2">
                POPÜLER ARAMALAR
              </div>
              <div className="grid grid-cols-2 gap-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={index}
                    className="text-left px-3 py-1.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                    onClick={() => handleResultClick(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}