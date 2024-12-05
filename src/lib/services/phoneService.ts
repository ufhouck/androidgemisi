import { Phone } from '../../types/phone';
import { storage } from '../storage';
import { cache } from '../cache';
import { generatePhoneId } from '../utils/phoneUtils';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../utils/cacheUtils';

export async function getPhone(id: string): Promise<Phone | null> {
  const cacheKey = generateCacheKey(CACHE_KEYS.PHONE, id);
  
  // Check memory cache
  const cachedPhone = cache.get<Phone>(cacheKey);
  if (cachedPhone) return cachedPhone;

  // Check storage
  const storedPhone = await storage.get<Phone>(cacheKey);
  if (storedPhone) {
    cache.set(cacheKey, storedPhone, CACHE_DURATIONS.MEDIUM);
    return storedPhone;
  }

  return null;
}

export async function getAllPhones(): Promise<Phone[]> {
  const phones = await storage.getAllPhones();
  return phones;
}

export async function updatePhoneData(phone: Phone): Promise<void> {
  const cacheKey = generateCacheKey(CACHE_KEYS.PHONE, phone.id);
  
  await storage.updatePhone(phone.id, phone);
  cache.set(cacheKey, phone, CACHE_DURATIONS.MEDIUM);
}