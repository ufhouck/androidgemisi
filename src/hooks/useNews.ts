import { useState, useEffect } from 'react';
import { getLatestNews } from '../services/newsService';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  source: string;
  link: string;
  imageUrl?: string;
}

export function useNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const latestNews = await getLatestNews();
        setNews(latestNews);
        setIsLoading(false);
      } catch (err) {
        setError('Haberler yüklenirken bir hata oluştu');
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  return { news, isLoading, error };
}