import { PHONE_CATALOG } from '../data/phoneCatalog';
import { scrapePhoneData } from './phoneScraping';
import { scrapeAndAnalyzeReviews } from './reviewScraping';
import { addPhone, updatePhone, phones } from '../data/phones';
import { cache } from '../lib/cache';

async function processPhone(brand: string, model: string) {
  const fullModel = `${brand} ${model}`;
  const phoneId = fullModel.toLowerCase().replace(/[^a-z0-9]+/g, '');
  
  try {
    console.log(`Processing ${fullModel}...`);
    
    const phoneData = await scrapePhoneData(fullModel);
    const reviews = await scrapeAndAnalyzeReviews(phoneId, fullModel);
    
    const existingPhone = phones.find(p => p.id === phoneId);
    if (existingPhone) {
      updatePhone(phoneId, {
        ...existingPhone,
        ...phoneData,
        reviews: reviews.length
      });
    } else {
      addPhone({
        ...phoneData,
        reviews: reviews.length
      });
    }
    
    console.log(`✓ Completed ${fullModel}`);
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  } catch (error) {
    console.error(`Error processing ${fullModel}:`, error);
  }
}

export async function initializeData() {
  console.log('Starting initial data collection...');
  
  for (const [brand, models] of Object.entries(PHONE_CATALOG)) {
    console.log(`\nProcessing ${brand} phones...`);
    
    for (const model of models) {
      await processPhone(brand, model);
    }
  }
  
  console.log('\nInitial data collection completed!');
  cache.clear();
}