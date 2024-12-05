import { Review } from '../types/review';
import { cache } from '../lib/cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../lib/utils/cacheUtils';
import { getAllSourceReviews } from './reviews/sources';

export async function getReviews(phoneModel: string): Promise<Review[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneModel);
  
  try {
    // Check cache first
    const cachedReviews = await cache.get<Review[]>(cacheKey);
    if (cachedReviews?.length > 0) {
      return cachedReviews;
    }

    // Get reviews from all sources
    const reviews = await getAllSourceReviews(phoneModel);
    
    if (reviews.length > 0) {
      await cache.set(cacheKey, reviews, CACHE_DURATIONS.MEDIUM);
    }

    return reviews;
  } catch (error) {
    console.error('Error in getReviews:', error);
    return [];
  }
}