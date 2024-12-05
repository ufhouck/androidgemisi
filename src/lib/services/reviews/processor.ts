import { Review } from '../../../types/review';
import { analyzeSentiment } from './sentiment';
import { extractAspects } from './aspects';
import { normalizeText, removeDuplicateSentences } from '../../utils/textUtils';

export async function processReviews(reviews: Review[]): Promise<Review[]> {
  // Remove duplicates first
  const uniqueReviews = removeDuplicateReviews(reviews);
  
  // Process each review
  return uniqueReviews.map(review => ({
    ...review,
    comment: removeDuplicateSentences(normalizeText(review.comment)),
    sentiment: analyzeSentiment(review.comment),
    aspects: extractAspects(review.comment)
  }));
}

function removeDuplicateReviews(reviews: Review[]): Review[] {
  const seen = new Set<string>();
  return reviews.filter(review => {
    const fingerprint = `${review.comment.slice(0, 100)}${review.rating}`;
    if (seen.has(fingerprint)) return false;
    seen.add(fingerprint);
    return true;
  });
}