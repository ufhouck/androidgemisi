import { Phone } from '../types/phone';
import { storage } from '../lib/storage';

// In-memory phones array
export let phones: Phone[] = [];

// Initialize phones from storage
export async function initializePhones() {
  const storedPhones = await storage.getAllPhones();
  phones = storedPhones;
}

// Call initialization when module loads
initializePhones().catch(console.error);

// Export phones array
export default phones;