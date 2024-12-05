import { useState, useEffect, useCallback } from 'react';
import { phones } from '../data/phones';
import { getReviewsByPhoneId, getAverageRating } from '../data/reviews';

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

function getReviewSummary(reviews: any[]) {
  if (reviews.length === 0) return "Henüz yorum yapılmamış";
  
  const positiveCount = reviews.filter(r => r.rating >= 4).length;
  const percentage = Math.round((positiveCount / reviews.length) * 100);
  
  if (percentage >= 80) return "Kullanıcılar çok memnun";
  if (percentage >= 60) return "Kullanıcılar memnun";
  if (percentage >= 40) return "Karma yorumlar";
  return "İyileştirmeye açık";
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopular, setShowPopular] = useState(false);

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

        const reviews = getReviewsByPhoneId(phone.id);
        const rating = getAverageRating(phone.id);

        return {
          phone,
          score,
          reviews: {
            rating,
            count: reviews.length,
            summary: getReviewSummary(reviews)
          }
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
        reviews: item.reviews
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

  return {
    query,
    setQuery,
    results,
    isLoading,
    popularSearches: POPULAR_SEARCHES,
    showPopular
  };
}