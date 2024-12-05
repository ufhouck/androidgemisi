import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Loader2, Star, MessageSquare, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSearch } from '../../hooks/useSearch';
import { useNavigate } from 'react-router-dom';
import { phones } from '../../data/phones';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  placeholderClassName?: string;
  onResultClick?: () => void;
  variant?: 'default' | 'compact';
}

export function SearchBar({ 
  className, 
  placeholder = "Telefon modeli ara...", 
  placeholderClassName,
  onResultClick,
  variant = 'default'
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const { query, setQuery, results, isLoading, recentSearches, clearRecentSearches, popularBrands } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isCompact = variant === 'compact' || isMobile;

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

  const handleResultClick = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    setQuery(name);
    setShowResults(false);
    setFocused(false);
    navigate(`/telefon/${slug}`);
    onResultClick?.();
  };

  const handleBrandClick = (brandId: string) => {
    navigate(`/karsilastir?brand=${brandId}`);
    setShowResults(false);
    setFocused(false);
    onResultClick?.();
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/karsilastir?q=${encodeURIComponent(query)}`);
      setShowResults(false);
      setFocused(false);
      onResultClick?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div 
        className={cn(
          "flex items-center gap-2 bg-white rounded-full transition-all duration-200 cursor-text",
          focused 
            ? "border border-orange-500" 
            : "border border-gray-200 hover:border-gray-300",
          isCompact ? "px-3 py-2" : "px-5 py-3.5"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <Search className={cn(
          isCompact ? "h-4 w-4" : "h-5 w-5",
          focused ? "text-orange-600" : "text-gray-400"
        )} />
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex-1 bg-transparent outline-none placeholder:text-gray-400",
            isCompact ? "text-sm" : "text-base"
          )}
          placeholder={placeholder}
          onFocus={() => {
            setFocused(true);
            setShowResults(true);
          }}
        />

        {isLoading && (
          <Loader2 className={cn(
            "animate-spin text-gray-400",
            isCompact ? "h-4 w-4" : "h-5 w-5"
          )} />
        )}
      </div>

      {showResults && (
        <div className={cn(
          "absolute left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 divide-y divide-gray-100",
          isCompact 
            ? "top-[calc(100%+0.5rem)] max-h-[80vh]" 
            : "top-full mt-2 max-h-[60vh]",
          "overflow-y-auto overscroll-contain"
        )}>
          {query ? (
            results.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {results.map((result) => (
                  <button
                    key={result.id}
                    className={cn(
                      "w-full text-left hover:bg-gray-50 transition-colors",
                      isCompact ? "px-3 py-2" : "px-4 py-3"
                    )}
                    onClick={() => handleResultClick(result.name)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <p className={cn(
                          "font-medium truncate",
                          isCompact ? "text-sm" : "text-base"
                        )}>{result.name}</p>
                        <p className={cn(
                          "text-gray-600 truncate",
                          isCompact ? "text-xs" : "text-sm"
                        )}>{result.specs.processor}</p>
                      </div>
                      <span className={cn(
                        "text-orange-600 font-semibold whitespace-nowrap",
                        isCompact ? "text-xs" : "text-sm"
                      )}>
                        {result.price.tr}
                      </span>
                    </div>
                    <div className={cn(
                      "flex items-center gap-3 text-gray-500 mt-1",
                      isCompact ? "text-xs" : "text-sm"
                    )}>
                      <div className="flex items-center">
                        <Star className={cn(
                          "text-yellow-400 fill-current mr-1",
                          isCompact ? "h-3 w-3" : "h-4 w-4"
                        )} />
                        <span>{result.reviews.rating.toFixed(1)}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className={cn(
                          "mr-1",
                          isCompact ? "h-3 w-3" : "h-4 w-4"
                        )} />
                        <span>{result.reviews.count} yorum</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className={cn(
                "text-center",
                isCompact ? "px-3 py-6" : "px-4 py-8"
              )}>
                <p className="text-gray-500 mb-2">Sonuç bulunamadı</p>
                <button
                  onClick={handleSearch}
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Tüm telefonlarda ara
                </button>
              </div>
            )
          ) : (
            <div className={cn(
              "divide-y divide-gray-100",
              isCompact ? "p-3" : "p-4"
            )}>
              {recentSearches.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn(
                      "font-medium text-gray-400",
                      isCompact ? "text-[10px]" : "text-xs"
                    )}>
                      SON ARAMALAR
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className={cn(
                        "text-gray-400 hover:text-gray-600",
                        isCompact ? "text-[10px]" : "text-xs"
                      )}
                    >
                      Temizle
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className={cn(
                          "w-full flex items-center text-gray-600 hover:bg-orange-50 rounded-lg transition-colors",
                          isCompact ? "px-2 py-1.5 text-xs" : "px-3 py-2 text-sm"
                        )}
                        onClick={() => handleResultClick(search)}
                      >
                        <Clock className={cn(
                          "mr-2 text-gray-400",
                          isCompact ? "h-3 w-3" : "h-4 w-4"
                        )} />
                        <span className="truncate">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={cn(
                recentSearches.length > 0 && "pt-4"
              )}>
                <div className={cn(
                  "font-medium text-gray-400 mb-2",
                  isCompact ? "text-[10px]" : "text-xs"
                )}>
                  POPÜLER MARKALAR
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularBrands.map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => handleBrandClick(brand.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors",
                        isCompact ? "text-xs" : "text-sm"
                      )}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}