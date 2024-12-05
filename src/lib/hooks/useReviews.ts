import { useState, useEffect, useCallback } from 'react';
import { Review } from '../../types/review';
import { processReviewQueue } from '../services/reviewQueue';

export function useReviews(phoneModel: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (retryCount = 0) => {
    try {
      const fetchedReviews = await processReviewQueue(phoneModel);
      
      // Filter out duplicate reviews
      const uniqueReviews = fetchedReviews.filter((review, index, self) =>
        index === self.findIndex((r) => r.comment === review.comment)
      );
      
      setReviews(uniqueReviews);
      setError(null);
    } catch (err) {
      const maxRetries = 2;
      if (retryCount < maxRetries) {
        console.log(`Retrying... Attempt ${retryCount + 1} of ${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
        return fetchReviews(retryCount + 1);
      }
      setError('Yorumlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  }, [phoneModel]);

  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      try {
        setIsLoading(true);
        await fetchReviews();
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadReviews();

    return () => {
      mounted = false;
    };
  }, [fetchReviews]);

  return { reviews, isLoading, error };
}