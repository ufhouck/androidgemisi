import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Star, MessageSquare, Clock, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSearch } from '../../hooks/useSearch';
import { useNavigate } from 'react-router-dom';
import { phones } from '../../data/phones';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  placeholderClassName?: string;
  onResultClick?: () => void;
}

// Get top 4 phones by rating
const getTopPhones = () => {
  return [...phones]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
    .map(phone => ({
      id: phone.id,
      name: phone.name,
      price: phone.price,
      specs: phone.specs,
      rating: phone.rating
    }));
};

export function SearchBar({ 
  className, 
  placeholder = "Telefon modeli ara...", 
  placeholderClassName,
  onResultClick 
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const { query, setQuery, results, isLoading, recentSearches, clearRecentSearches } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const topPhones = getTopPhones();

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
          "flex items-center gap-3 bg-white rounded-full transition-all duration-200 cursor-text",
          focused 
            ? "border border-orange-500" 
            : "border border-gray-200 hover:border-gray-300",
          isMobile ? "px-4 py-2.5" : "px-5 py-3.5"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        <Search className={cn(
          "h-5 w-5",
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
          className="flex-1 bg-transparent outline-none text-base placeholder:text-gray-400"
          placeholder={placeholder}
          onFocus={() => {
            setFocused(true);
            setShowResults(true);
          }}
        />

        {isLoading && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
      </div>

      {showResults && (
        <div className={cn(
          "absolute left-0 right-0 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 divide-y divide-gray-100",
          isMobile ? "top-[calc(100%+0.5rem)] max-h-[70vh]" : "top-full mt-2 max-h-[60vh]",
          "overflow-y-auto overscroll-contain"
        )}>
          {query ? (
            results.length > 0 ? (
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
            ) : (
              <div className="px-4 py-8 text-center">
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
            <div className="p-4">
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-medium text-gray-400">
                      SON ARAMALAR
                    </div>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-400 hover:text-gray-600"
                    >
                      Temizle
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-orange-50 rounded-lg transition-colors"
                        onClick={() => handleResultClick(search)}
                      >
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{search}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className="text-xs font-medium text-gray-400 mb-2">
                  EN ÇOK BEĞENİLEN TELEFONLAR
                </div>
                <div className="space-y-1">
                  {topPhones.map((phone) => (
                    <button
                      key={phone.id}
                      className="w-full px-3 py-2 text-left hover:bg-orange-50 rounded-lg transition-colors"
                      onClick={() => handleResultClick(phone.name)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{phone.name}</p>
                          <p className="text-sm text-gray-500">{phone.specs.processor}</p>
                        </div>
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="font-medium">{phone.rating.toFixed(1)}</span>
                        </div>
                      </div>
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