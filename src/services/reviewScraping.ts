import { Review } from '../types/review';
import { cache } from '../lib/cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../lib/utils/cacheUtils';
import { generateMockReviews } from '../data/mockReviews';

export async function getAllReviews(model: string): Promise<Review[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, model);
  
  try {
    // Check cache first
    const cachedReviews = await cache.get<Review[]>(cacheKey);
    if (cachedReviews && Array.isArray(cachedReviews) && cachedReviews.length > 0) {
      return cachedReviews;
    }

    // Generate mock reviews with improved variety
    const phoneId = model.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const reviews = generateMockReviews(phoneId, model);
    
    if (reviews.length > 0) {
      await cache.set(cacheKey, reviews, CACHE_DURATIONS.SHORT);
    }

    return reviews;
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}