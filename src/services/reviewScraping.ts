import { Review } from '../types/review';
import { cache } from '../lib/cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../lib/utils/cacheUtils';
import { getPhoneReviews } from './reviewAnalysis';

export async function getAllReviews(model: string): Promise<Review[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, model);
  
  try {
    // Check cache first
    const cachedReviews = await cache.get<Review[]>(cacheKey);
    if (cachedReviews && Array.isArray(cachedReviews) && cachedReviews.length > 0) {
      return cachedReviews;
    }

    // Get fresh reviews
    const reviews = await getPhoneReviews(model);
    
    if (reviews.length > 0) {
      await cache.set(cacheKey, reviews, CACHE_DURATIONS.SHORT);
    }

    return reviews;
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}