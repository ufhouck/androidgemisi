import { startDataCollection } from '../src/services/dataCollectionService.js';

console.log('Starting data collection process...');

startDataCollection()
  .then(() => {
    console.log('Data collection completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Error during data collection:', error);
    process.exit(1);
  });