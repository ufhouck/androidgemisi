import { getAllSourceReviews } from '../src/services/reviews/sources/index.js';
import { cache } from '../src/lib/cache.js';
import { CACHE_KEYS, CACHE_DURATIONS } from '../src/lib/utils/cacheUtils.js';
import { phones } from '../src/data/phones.js';

async function scrapeAllPhones() {
  console.log('Starting review scraping for all phones...');

  for (const phone of phones) {
    console.log(`\nProcessing ${phone.name}...`);
    
    try {
      const reviews = await getAllSourceReviews(phone.name);
      
      if (reviews.length > 0) {
        const cacheKey = `${CACHE_KEYS.REVIEWS}_${phone.id}`;
        await cache.set(cacheKey, reviews, CACHE_DURATIONS.MEDIUM);
        console.log(`✓ Saved ${reviews.length} reviews for ${phone.name}`);
      } else {
        console.log(`No reviews found for ${phone.name}`);
      }
      
      // Add delay between requests
      await new Promise(resolve => setTimeout(resolve, 5000));
    } catch (error) {
      console.error(`Error processing ${phone.name}:`, error);
    }
  }

  console.log('\nReview scraping completed!');
}

// Run the scraper
scrapeAllPhones().catch(console.error);