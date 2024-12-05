import { Review } from '../../../types/review';
import { cache } from '../../cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../../utils/cacheUtils';
import { generateReviews } from './reviewGenerator';

export async function getReviews(phoneModel: string, brand: string): Promise<Review[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneModel);
  
  try {
    // Check cache first
    const cachedReviews = await cache.get<Review[]>(cacheKey);
    if (cachedReviews?.length > 0) {
      return cachedReviews;
    }

    // Generate new reviews
    const reviews = generateReviews(phoneModel, brand);
    
    // Cache the results
    if (reviews.length > 0) {
      await cache.set(cacheKey, reviews, CACHE_DURATIONS.MEDIUM);
    }

    return reviews;
  } catch (error) {
    console.error('Error in getReviews:', error);
    return [];
  }
}

export async function getReviewStats(phoneModel: string, brand: string): Promise<{
  totalReviews: number;
  averageRating: number;
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
}> {
  const reviews = await getReviews(phoneModel, brand);
  
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      sentimentDistribution: {
        positive: 0,
        neutral: 0,
        negative: 0
      }
    };
  }

  const sentimentCounts = reviews.reduce((acc, review) => {
    acc[review.sentiment || 'neutral']++;
    return acc;
  }, { positive: 0, neutral: 0, negative: 0 });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    totalReviews: reviews.length,
    averageRating: Number((totalRating / reviews.length).toFixed(1)),
    sentimentDistribution: {
      positive: Math.round((sentimentCounts.positive / reviews.length) * 100),
      neutral: Math.round((sentimentCounts.neutral / reviews.length) * 100),
      negative: Math.round((sentimentCounts.negative / reviews.length) * 100)
    }
  };
}