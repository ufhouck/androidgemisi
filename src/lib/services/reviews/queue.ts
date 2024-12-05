import PQueue from 'p-queue';
import { RateLimiterMemory } from 'rate-limiter-flexible';

// Rate limiter for each source
const rateLimiter = new RateLimiterMemory({
  points: 2, // Number of requests
  duration: 10, // Per 10 seconds
});

// Queue for processing review requests
export const reviewQueue = new PQueue({
  concurrency: 1,
  interval: 2000,
  intervalCap: 1,
  timeout: 30000,
  throwOnTimeout: true
});

// Add rate limiting to queue
reviewQueue.on('active', () => {
  rateLimiter.consume('reviews', 1).catch(() => {
    console.log('Rate limit reached, waiting...');
  });
});

// Error handling
reviewQueue.on('error', (error) => {
  console.error('Queue error:', error);
  reviewQueue.clear();
});

reviewQueue.on('timeout', () => {
  console.error('Queue timeout');
  reviewQueue.clear();
});