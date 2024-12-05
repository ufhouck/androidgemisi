import { Review } from '../../types/review';
import { storage } from '../storage';
import { cache } from '../cache';
import { generateReviewId } from '../utils/reviewUtils';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../utils/cacheUtils';
import { generateMockReviews } from '../../data/mockReviews';

export async function getPhoneReviews(phoneId: string, phoneName: string): Promise<Review[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneId);
  
  // Check memory cache
  const cachedReviews = cache.get<Review[]>(cacheKey);
  if (cachedReviews) return cachedReviews;

  // Check storage
  const storedReviews = await storage.get<Review[]>(cacheKey);
  if (storedReviews && Array.isArray(storedReviews)) {
    cache.set(cacheKey, storedReviews, CACHE_DURATIONS.SHORT);
    return storedReviews;
  }

  // Generate mock reviews if none exist
  const reviews = generateMockReviews(phoneId, phoneName);
  
  // Store reviews
  await storage.set(cacheKey, reviews, CACHE_DURATIONS.LONG);
  cache.set(cacheKey, reviews, CACHE_DURATIONS.SHORT);

  return reviews;
}

export async function updatePhoneReviews(phoneId: string, reviews: Review[]): Promise<void> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneId);
  
  await storage.set(cacheKey, reviews, CACHE_DURATIONS.LONG);
  cache.set(cacheKey, reviews, CACHE_DURATIONS.SHORT);
}