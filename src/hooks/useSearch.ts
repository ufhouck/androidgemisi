import { useState, useEffect, useCallback } from 'react';
import { phones } from '../data/phones';
import { getReviewsByPhoneId, getAverageRating } from '../data/reviews';
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

const POPULAR_SEARCHES = [
  'Samsung Galaxy S24 Ultra',
  'Google Pixel 8 Pro',
  'OnePlus 12',
  'Xiaomi 14 Pro'
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

function getReviewSummary(rating: number, count: number): string {
  if (count === 0) return "Henüz yorum yapılmamış";
  if (rating >= 4.5) return "Kullanıcılar çok memnun";
  if (rating >= 4.0) return "Kullanıcılar memnun";
  if (rating >= 3.0) return "Karma yorumlar";
  return "İyileştirmeye açık";
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchPhones = useCallback(async (searchQuery: string) => {
    const normalizedQuery = normalizeText(searchQuery);
    
    if (!normalizedQuery) {
      return [];
    }

    const searchResults = await Promise.all(
      phones
        .map(async phone => {
          const normalizedName = normalizeText(phone.name);
          const normalizedProcessor = normalizeText(phone.specs.processor);
          
          let score = 0;
          
          // Exact match
          if (normalizedName === normalizedQuery) {
            score += 100;
          }
          // Starts with query
          else if (normalizedName.startsWith(normalizedQuery)) {
            score += 75;
          }
          // Contains query
          else if (normalizedName.includes(normalizedQuery)) {
            score += 50;
          }
          // Processor match
          if (normalizedProcessor.includes(normalizedQuery)) {
            score += 25;
          }
          // RAM match
          if (normalizeText(phone.specs.ram).includes(normalizedQuery)) {
            score += 25;
          }

          if (score === 0) return null;

          // Get reviews from cache or storage
          const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phone.id);
          let reviews = cache.get<any[]>(cacheKey) || [];
          if (!reviews.length) {
            reviews = await getReviewsByPhoneId(phone.id);
          }

          const rating = getAverageRating(phone.id);

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
                rating,
                count: reviews.length,
                summary: getReviewSummary(rating, reviews.length)
              }
            }
          };
        })
    );

    return searchResults
      .filter(item => item !== null)
      .sort((a, b) => b!.score - a!.score)
      .map(item => item!.result);
  }, []);

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
    popularSearches: POPULAR_SEARCHES
  };
}