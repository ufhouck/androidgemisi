import { Review } from '../../types/review';
import { analyzeSentiment } from './reviews/sentiment';
import { extractAspects } from './reviews/aspects';
import { normalizeText } from '../utils/textUtils';

export async function analyzeReview(review: Partial<Review>): Promise<Review> {
  const normalizedComment = normalizeText(review.comment || '');
  const sentiment = analyzeSentiment(normalizedComment);
  const aspects = extractAspects(normalizedComment);

  return {
    id: review.id || `review_${Date.now()}`,
    phoneId: review.phoneId || '',
    userName: review.userName || 'Anonim Kullanıcı',
    rating: review.rating || 0,
    comment: normalizedComment,
    likes: review.likes || 0,
    dislikes: review.dislikes || 0,
    date: review.date || new Date().toISOString(),
    aspects,
    sentiment,
    source: review.source || 'unknown'
  };
}

export async function analyzeReviews(reviews: Partial<Review>[]): Promise<Review[]> {
  const analyzedReviews = await Promise.all(
    reviews.map(review => analyzeReview(review))
  );

  return analyzedReviews.filter(review => 
    review.comment && review.comment.length > 10 && review.rating > 0
  );
}