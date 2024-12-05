import { cache } from '../../cache';
import { Review } from '../../../types/review';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../../utils/cacheUtils';

export async function getCachedReviews(phoneModel: string): Promise<Review[] | null> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneModel);
  return cache.get<Review[]>(cacheKey);
}

export async function cacheReviews(phoneModel: string, reviews: Review[]): Promise<void> {
  if (reviews.length === 0) return;
  
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneModel);
  await cache.set(cacheKey, reviews, CACHE_DURATIONS.MEDIUM);
}

export async function invalidateReviewCache(phoneModel: string): Promise<void> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneModel);
  await cache.delete(cacheKey);
}