import { Review } from '../../../../types/review';
import { epeyReviews } from './epeySource';
import { teknosaReviews } from './teknosaSource';
import { vatanReviews } from './vatanSource';
import { donanimhaberReviews } from './donanimhaberSource';
import { shiftDeleteReviews } from './shiftDeleteSource';
import PQueue from 'p-queue';

const queue = new PQueue({
  concurrency: 1,
  interval: 2000,
  intervalCap: 1
});

export async function getAllSourceReviews(model: string): Promise<Review[]> {
  try {
    // Queue all review fetching tasks
    const reviewTasks = [
      () => epeyReviews(model),
      () => teknosaReviews(model),
      () => vatanReviews(model),
      () => donanimhaberReviews(model),
      () => shiftDeleteReviews(model)
    ];

    // Process tasks with rate limiting
    const results = await Promise.allSettled(
      reviewTasks.map(task => queue.add(task))
    );

    // Combine successful results
    const allReviews = results
      .filter((result): result is PromiseFulfilledResult<Review[]> => 
        result.status === 'fulfilled'
      )
      .flatMap(result => result.value);

    // Remove duplicates
    return removeDuplicateReviews(allReviews);
  } catch (error) {
    console.error('Error fetching reviews from sources:', error);
    return [];
  }
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