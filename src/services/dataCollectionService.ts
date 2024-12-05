import PQueue from 'p-queue';
import { storage } from '../lib/storage';
import { PHONE_CATALOG } from '../data/phoneCatalog';
import { scrapePhoneData } from './phoneScraping';
import { scrapeAndAnalyzeReviews } from './reviewScraping';
import { addPhone, updatePhone, phones } from '../data/phones';

// Create a queue with concurrency limit and rate limiting
const queue = new PQueue({ 
  concurrency: 1,
  interval: 5000, // 5 seconds between tasks
  intervalCap: 1 // Only process one task per interval
});

let isCollecting = false;
const COLLECTION_INTERVAL = 12 * 60 * 60 * 1000; // 12 hours

async function processPhone(brand: string, model: string): Promise<void> {
  const fullModel = `${brand} ${model}`;
  const phoneId = fullModel.toLowerCase().replace(/[^a-z0-9]+/g, '');
  
  try {
    console.log(`Processing ${fullModel}...`);
    
    // Check if we already have recent data
    const lastUpdate = await storage.get<number>(`${phoneId}_last_update`);
    const now = Date.now();
    
    if (lastUpdate && (now - lastUpdate) < COLLECTION_INTERVAL) {
      console.log(`Skipping ${fullModel} - Data is still fresh`);
      return;
    }
    
    // First, get phone data
    const phoneData = await scrapePhoneData(fullModel);
    const existingPhone = phones.find(p => p.id === phoneId);
    
    if (existingPhone) {
      updatePhone(phoneId, {
        ...existingPhone,
        ...phoneData
      });
    } else {
      addPhone(phoneData);
    }
    
    // Then, get and analyze reviews with retries
    let retries = 3;
    let reviews = [];
    
    while (retries > 0) {
      try {
        reviews = await scrapeAndAnalyzeReviews(phoneId, fullModel);
        break;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
    
    console.log(`Found ${reviews.length} reviews for ${fullModel}`);
    
    // Store last update time
    await storage.set(`${phoneId}_last_update`, now);
    await storage.set('lastUpdate', now);
    
    console.log(`✓ Completed ${fullModel}`);
  } catch (error) {
    console.error(`Error processing ${fullModel}:`, error);
  }
}

export async function startDataCollection(): Promise<void> {
  if (isCollecting) {
    console.log('Data collection already in progress...');
    return;
  }

  isCollecting = true;
  console.log('Starting data collection...');

  try {
    // Clear queue before starting new collection
    queue.clear();

    // Add all phones to the queue
    for (const [brand, models] of Object.entries(PHONE_CATALOG)) {
      for (const model of models) {
        queue.add(() => processPhone(brand, model));
      }
    }

    // Wait for all tasks to complete
    await queue.onIdle();
    console.log('Data collection completed!');
  } catch (error) {
    console.error('Error during data collection:', error);
  } finally {
    isCollecting = false;
  }
}

// Start periodic data collection
let collectionInterval: NodeJS.Timeout;

export function startPeriodicCollection(): void {
  // Clear any existing interval
  if (collectionInterval) {
    clearInterval(collectionInterval);
  }
  
  // Initial collection
  startDataCollection();
  
  // Set up periodic collection
  collectionInterval = setInterval(() => {
    startDataCollection();
  }, COLLECTION_INTERVAL);
}

// Stop periodic collection
export function stopPeriodicCollection(): void {
  if (collectionInterval) {
    clearInterval(collectionInterval);
  }
}