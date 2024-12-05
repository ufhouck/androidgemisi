import { Review } from '../../types/review';
import { cache } from '../cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../utils/cacheUtils';
import { generateMockReviews } from '../../data/mockReviews';

const REVIEW_CACHE_DURATION = 60 * 60; // 1 hour

export async function getReviews(phoneModel: string): Promise<Review[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneModel);
  
  try {
    // Check cache first
    const cachedReviews = await cache.get<Review[]>(cacheKey);
    if (cachedReviews?.length > 0) {
      return cachedReviews;
    }

    // Generate reviews for this phone model
    const phoneId = phoneModel.toLowerCase().replace(/[^a-z0-9]+/g, '');
    const brand = phoneModel.split(' ')[0];
    const reviews = generateMockReviews(phoneId, brand);

    // Cache the results
    if (reviews.length > 0) {
      await cache.set(cacheKey, reviews, REVIEW_CACHE_DURATION);
    }

    return reviews;
  } catch (error) {
    console.error('Error in getReviews:', error);
    return [];
  }
}