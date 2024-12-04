import { analyzeAllReviews } from '../src/services/reviewAnalysis.js';
import cron from 'node-cron';
import { phones } from '../src/data/phones.js';

async function updateReviewAnalysis() {
  console.log('Analyzing reviews...');
  try {
    for (const phone of phones) {
      // Here you would fetch reviews from your data source
      const reviews = []; // Fetch reviews for phone.id
      await analyzeAllReviews(phone.id, reviews);
    }
    console.log('Review analysis completed');
  } catch (error) {
    console.error('Error analyzing reviews:', error);
  }
}

// Update review analysis daily at midnight
cron.schedule('0 0 * * *', updateReviewAnalysis);

// Initial analysis
updateReviewAnalysis().catch(console.error);