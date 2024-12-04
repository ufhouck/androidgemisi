import React, { useState, useRef, useEffect } from 'react';
import { Search, Loader2, Calendar, Clock, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useSearch } from '../../hooks/useSearch';
import { useNavigate } from 'react-router-dom';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

export function SearchBar({ className, placeholder = "Telefon modeli, işlemci veya RAM ile arama yapın..." }: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const { 
    query, 
    setQuery, 
    results, 
    isLoading,
    searchHistory,
    popularSearches,
    showPopular 
  } = useSearch();
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < (showPopular ? popularSearches.length : results.length) - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (showPopular) {
            handleSearchClick(popularSearches[selectedIndex]);
          } else {
            handleResultClick(results[selectedIndex].name);
          }
        }
        break;
      case 'Escape':
        setShowResults(false);
        break;
    }
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleResultClick = (name: string) => {
    setQuery(name);
    setShowResults(false);
    navigate(`/telefon/${slugify(name)}`);
  };

  const handleSearchClick = (searchQuery: string) => {
    setQuery(searchQuery);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className={cn(
      "relative w-full max-w-3xl mx-auto",
      className
    )}>
      <div className={cn(
        "flex items-center rounded-full border-2 bg-white px-6 py-4 transition-all duration-200",
        focused ? "border-orange-500 shadow-2xl" : "border-transparent shadow-lg",
      )}>
        {isLoading ? (
          <Loader2 className="h-5 w-5 text-orange-500 animate-spin" />
        ) : (
          <Search className="h-5 w-5 text-orange-500" />
        )}
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onKeyDown={handleKeyDown}
          className="ml-4 flex-1 bg-transparent outline-none placeholder:text-gray-400 text-lg"
          placeholder={placeholder}
          onFocus={() => {
            setFocused(true);
            setShowResults(true);
          }}
          onBlur={() => setFocused(false)}
        />
      </div>

      {showResults && (showPopular || results.length > 0 || searchHistory.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto z-50">
          {showPopular && (
            <div className="p-4 border-b">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>En Çok Arananlar</span>
              </div>
              <div className="space-y-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={search}
                    className={cn(
                      "w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors",
                      selectedIndex === index && "bg-orange-50"
                    )}
                    onClick={() => handleSearchClick(search)}
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchHistory.length > 0 && !showPopular && (
            <div className="p-4 border-b">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Clock className="h-4 w-4 mr-2" />
                <span>Son Aramalar</span>
              </div>
              <div className="space-y-2">
                {searchHistory.map((item, index) => (
                  <button
                    key={item.timestamp}
                    className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => handleSearchClick(item.query)}
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {results.map((result, index) => (
            <button
              key={result.id}
              className={cn(
                "w-full px-6 py-4 text-left hover:bg-gray-50 transition-all",
                selectedIndex === index && "bg-orange-50"
              )}
              onClick={() => handleResultClick(result.name)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div>
                <p className="font-medium text-lg">{result.name}</p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
                  <span>{result.specs.processor}</span>
                  <span>{result.specs.ram}</span>
                </div>
                <div className="mt-3 flex items-center space-x-4">
                  <span className="text-orange-600 font-semibold text-lg">{result.price.tr}</span>
                  <span className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(result.releaseDate).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long'
                    })}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}