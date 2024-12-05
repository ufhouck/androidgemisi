import { Review } from '../types/review';
import { generateMockReviews } from '../data/mockReviews';
import { storage } from '../lib/storage';
import { cache } from '../lib/cache';

export async function scrapeAndAnalyzeReviews(phoneId: string, model: string): Promise<Review[]> {
  try {
    // Check memory cache first
    const cachedReviews = cache.get<Review[]>(`reviews_${phoneId}`);
    if (cachedReviews) {
      return cachedReviews;
    }

    // Check persistent storage
    const storedReviews = await storage.get<Review[]>(`reviews_${phoneId}`);
    if (storedReviews && Array.isArray(storedReviews) && storedReviews.length > 0) {
      cache.set(`reviews_${phoneId}`, storedReviews, 3600); // Cache for 1 hour
      return storedReviews;
    }

    // Generate mock reviews
    const reviews = generateMockReviews(phoneId, model);

    // Store in both caches
    cache.set(`reviews_${phoneId}`, reviews, 3600);
    await storage.set(`reviews_${phoneId}`, reviews, 12 * 60 * 60);

    return reviews;
  } catch (error) {
    console.error('Error generating reviews:', error);
    return [];
  }
}

export async function getReviews(phoneId: string): Promise<Review[]> {
  try {
    // Check memory cache first
    const cachedReviews = cache.get<Review[]>(`reviews_${phoneId}`);
    if (cachedReviews) {
      return cachedReviews;
    }

    // Check persistent storage
    const storedReviews = await storage.get<Review[]>(`reviews_${phoneId}`);
    if (storedReviews && Array.isArray(storedReviews)) {
      cache.set(`reviews_${phoneId}`, storedReviews, 3600);
      return storedReviews;
    }

    return [];
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}

export function clearReviewCache(): void {
  cache.clear();
}