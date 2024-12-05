import { Review } from '../../types/review';

export function calculateAverageRating(reviews: Review[]): number {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
}

export function generateReviewId(phoneId: string, index: number): string {
  return `${phoneId}_${Date.now()}_${index}`;
}

export function sortReviewsByDate(reviews: Review[]): Review[] {
  return [...reviews].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}