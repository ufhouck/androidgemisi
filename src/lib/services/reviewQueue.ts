import PQueue from 'p-queue';
import { Review } from '../../types/review';
import { getReviews } from './reviewService';
import { cache } from '../cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../utils/cacheUtils';

const queue = new PQueue({
  concurrency: 1,
  interval: 3000,
  intervalCap: 1,
  timeout: 30000
});

const processingStates = new Map<string, boolean>();

export async function processReviewQueue(phoneModel: string): Promise<Review[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneModel);
  
  try {
    if (processingStates.get(phoneModel)) {
      console.log(`Reviews for ${phoneModel} are already being processed...`);
      return [];
    }

    const existingReviews = await cache.get<Review[]>(cacheKey);
    if (existingReviews?.length > 0) {
      return existingReviews;
    }

    processingStates.set(phoneModel, true);

    try {
      const reviews = await queue.add(
        () => getReviews(phoneModel),
        { priority: 1 }
      );
      
      const uniqueReviews = Array.from(
        new Map(reviews.map(review => [review.comment, review])).values()
      );

      uniqueReviews.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      if (uniqueReviews.length > 0) {
        await cache.set(cacheKey, uniqueReviews, CACHE_DURATIONS.MEDIUM);
      }

      return uniqueReviews;
    } finally {
      processingStates.delete(phoneModel);
    }
  } catch (error) {
    console.error('Error processing review queue:', error);
    processingStates.delete(phoneModel);
    return [];
  }
}

queue.on('error', () => {
  queue.clear();
  processingStates.clear();
});

queue.on('timeout', () => {
  queue.clear();
  processingStates.clear();
});