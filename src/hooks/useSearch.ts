import { useState, useEffect, useCallback } from 'react';
import { phones } from '../data/phones';
import { storage } from '../lib/storage';
import { cache } from '../lib/cache';
import { CACHE_KEYS, generateCacheKey } from '../lib/utils/cacheUtils';

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
  reviews: {
    rating: number;
    count: number;
    summary: string;
  };
}

const MAX_RECENT_SEARCHES = 5;
const RECENT_SEARCHES_KEY = 'recent_searches';

const POPULAR_BRANDS = [
  { id: 'samsung', name: 'Samsung' },
  { id: 'xiaomi', name: 'Xiaomi' },
  { id: 'google', name: 'Google' },
  { id: 'oneplus', name: 'OnePlus' },
  { id: 'honor', name: 'Honor' }
];

const POPULAR_FILTERS = [
  { id: 'battery-5000', name: 'Uzun Pil Ömrü', filter: { key: 'battery', value: '5000+' } },
  { id: 'price-budget', name: 'Uygun Fiyat', filter: { key: 'price', value: '0-20000' } },
  { id: 'flagship', name: 'Amiral Gemisi', filter: { key: 'processor', value: 'snapdragon-8-gen-3' } }
];

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

function searchInSpecs(specs: any, query: string): number {
  let score = 0;
  const normalizedQuery = normalizeText(query);

  Object.values(specs).forEach((value) => {
    const normalizedValue = normalizeText(String(value));
    if (normalizedValue.includes(normalizedQuery)) {
      score += 25;
    }
  });

  return score;
}

function getReviewSummary(rating: number, count: number): string {
  if (count === 0) return "Henüz yorum yapılmamış";
  if (rating >= 4.5) return "Kullanıcılar çok memnun";
  if (rating >= 4.0) return "Kullanıcılar memnun";
  if (rating >= 3.0) return "Karma yorumlar";
  return "İyileştirmeye açık";
}

function phoneExists(name: string): boolean {
  const normalizedName = normalizeText(name);
  return phones.some(phone => normalizeText(phone.name) === normalizedName);
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    async function loadRecentSearches() {
      const saved = await storage.get<string[]>(RECENT_SEARCHES_KEY);
      if (saved && Array.isArray(saved)) {
        const validSearches = saved.filter(search => phoneExists(search));
        setRecentSearches(validSearches);
      }
    }
    loadRecentSearches();
  }, []);

  const addToRecentSearches = async (searchTerm: string) => {
    if (!phoneExists(searchTerm)) return;

    const newSearches = [
      searchTerm,
      ...recentSearches.filter(s => s !== searchTerm)
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(newSearches);
    await storage.set(RECENT_SEARCHES_KEY, newSearches);
  };

  const searchPhones = useCallback(async (searchQuery: string) => {
    const normalizedQuery = normalizeText(searchQuery);
    
    if (!normalizedQuery) {
      return [];
    }

    try {
      const searchResults = phones
        .map(phone => {
          const normalizedName = normalizeText(phone.name);
          let score = 0;
          
          if (normalizedName === normalizedQuery) {
            score += 100;
          } else if (normalizedName.startsWith(normalizedQuery)) {
            score += 75;
          } else if (normalizedName.includes(normalizedQuery)) {
            score += 50;
          }

          score += searchInSpecs(phone.specs, normalizedQuery);

          const nameWords = normalizedName.split(' ');
          nameWords.forEach(word => {
            if (word === normalizedQuery) {
              score += 40;
            } else if (word.startsWith(normalizedQuery)) {
              score += 30;
            } else if (word.includes(normalizedQuery)) {
              score += 20;
            }
          });

          if (score === 0) return null;

          return {
            score,
            result: {
              id: phone.id,
              name: phone.name,
              price: {
                tr: phone.price.tr
              },
              specs: {
                processor: phone.specs.processor,
                ram: phone.specs.ram
              },
              reviews: {
                rating: phone.rating,
                count: phone.reviews || 0,
                summary: getReviewSummary(phone.rating, phone.reviews || 0)
              }
            }
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a, b) => b.score - a.score)
        .map(item => item.result);

      if (searchResults.length > 0) {
        addToRecentSearches(searchQuery);
      }

      return searchResults;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }, [recentSearches]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (query.trim()) {
      setIsLoading(true);
      timeoutId = setTimeout(async () => {
        const searchResults = await searchPhones(query);
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

  return {
    query,
    setQuery,
    results,
    isLoading,
    recentSearches,
    popularBrands: POPULAR_BRANDS,
    popularFilters: POPULAR_FILTERS,
    clearRecentSearches: async () => {
      setRecentSearches([]);
      await storage.delete(RECENT_SEARCHES_KEY);
    }
  };
}