import { Review } from '../../../types/review';
import { reviewQueue } from './queue';
import { getCachedReviews, cacheReviews } from './cache';
import { getAllSourceReviews } from './sources';
import { processReviews } from './processor';

export async function getPhoneReviews(phoneModel: string): Promise<Review[]> {
  try {
    // Check cache first
    const cachedReviews = await getCachedReviews(phoneModel);
    if (cachedReviews?.length > 0) {
      return cachedReviews;
    }

    // Queue review fetching
    const reviews = await reviewQueue.add(
      async () => {
        const sourceReviews = await getAllSourceReviews(phoneModel);
        const processedReviews = await processReviews(sourceReviews);
        await cacheReviews(phoneModel, processedReviews);
        return processedReviews;
      },
      { priority: 1 }
    );

    return reviews;
  } catch (error) {
    console.error('Error in getPhoneReviews:', error);
    return [];
  }
}

export async function getReviews(phoneModel: string): Promise<Review[]> {
  return getPhoneReviews(phoneModel);
}