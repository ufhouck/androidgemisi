import { useState, useEffect, useCallback } from 'react';
import { phones } from '../data/phones';

interface SearchResult {
  id: string;
  name: string;
  price: {
    tr: string;
  };
  specs: {
    processor: string;
    ram: string;
  };
  releaseDate: string;
}

interface SearchHistory {
  query: string;
  timestamp: number;
}

const POPULAR_SEARCHES = [
  'Samsung Galaxy S24',
  'iPhone 15',
  'Google Pixel 8',
  'OnePlus 12',
  'Xiaomi 14'
];

const HISTORY_KEY = 'search_history';
const MAX_HISTORY_ITEMS = 5;

function normalizeText(text: string): string {
  return text.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

function getSearchHistory(): SearchHistory[] {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

function addToSearchHistory(query: string) {
  if (!query.trim()) return;

  const history = getSearchHistory();
  const newHistory = [
    { query, timestamp: Date.now() },
    ...history.filter(item => item.query !== query)
  ].slice(0, MAX_HISTORY_ITEMS);

  localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  const [showPopular, setShowPopular] = useState(false);

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const searchPhones = useCallback((searchQuery: string) => {
    const normalizedQuery = normalizeText(searchQuery);
    
    if (!normalizedQuery) {
      setShowPopular(true);
      return [];
    }

    setShowPopular(false);

    return phones
      .map(phone => {
        const normalizedName = normalizeText(phone.name);
        const normalizedProcessor = normalizeText(phone.specs.processor);
        
        let score = 0;
        
        if (normalizedName === normalizedQuery) {
          score += 100;
        }
        else if (normalizedName.startsWith(normalizedQuery)) {
          score += 75;
        }
        else if (normalizedName.includes(normalizedQuery)) {
          score += 50;
        }
        if (normalizedProcessor.includes(normalizedQuery)) {
          score += 25;
        }
        if (normalizeText(phone.specs.ram).includes(normalizedQuery)) {
          score += 25;
        }

        return {
          phone,
          score
        };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => ({
        id: item.phone.id,
        name: item.phone.name,
        price: {
          tr: item.phone.price.tr
        },
        specs: {
          processor: item.phone.specs.processor,
          ram: item.phone.specs.ram
        },
        releaseDate: item.phone.releaseDate
      }));
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (query.trim()) {
      setIsLoading(true);
      timeoutId = setTimeout(() => {
        const searchResults = searchPhones(query);
        setResults(searchResults);
        setIsLoading(false);
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [query, searchPhones]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    addToSearchHistory(searchQuery);
  };

  return {
    query,
    setQuery: handleSearch,
    results,
    isLoading,
    searchHistory,
    popularSearches: POPULAR_SEARCHES,
    showPopular
  };
}