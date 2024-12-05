import { Review } from '../types/review';
import { storage } from '../lib/storage';
import { generateMockReviews } from './mockReviews';
import { cache } from '../lib/cache';
import { phones } from './phones';

export async function getReviewsByPhoneId(phoneId: string): Promise<Review[]> {
  try {
    // Önce memory cache'e bak
    const cachedReviews = cache.get<Review[]>(`reviews_${phoneId}`);
    if (cachedReviews) {
      return cachedReviews;
    }

    // Storage'a bak
    const storedReviews = await storage.get<Review[]>(`reviews_${phoneId}`);
    if (storedReviews && Array.isArray(storedReviews) && storedReviews.length > 0) {
      cache.set(`reviews_${phoneId}`, storedReviews, 3600); // 1 saat cache
      return storedReviews;
    }

    // Eğer yorum bulunamazsa mock yorumlar oluştur
    const phone = phones.find(p => p.id === phoneId);
    if (!phone) return [];

    const reviews = generateMockReviews(phoneId, phone.name);
    
    // Her iki cache'e de kaydet
    cache.set(`reviews_${phoneId}`, reviews, 3600);
    await storage.set(`reviews_${phoneId}`, reviews, 12 * 60 * 60); // 12 saat
    
    return reviews;
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
}

export async function getAverageRating(phoneId: string): Promise<number> {
  try {
    const reviews = await getReviewsByPhoneId(phoneId);
    if (!Array.isArray(reviews) || reviews.length === 0) return 0;
    
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return 0;
  }
}

export function clearReviewCache(): void {
  cache.clear();
}