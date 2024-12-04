import { updateAllPrices } from '../src/services/priceTracking.js';
import cron from 'node-cron';

// Update prices every 3 days at midnight
cron.schedule('0 0 */3 * *', async () => {
  console.log('Updating prices...');
  try {
    await updateAllPrices();
    console.log('Prices updated successfully');
  } catch (error) {
    console.error('Error updating prices:', error);
  }
});

// Initial update
updateAllPrices().catch(console.error);