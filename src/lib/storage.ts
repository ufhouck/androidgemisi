import { set, get, del, clear } from 'idb-keyval';
import { Phone } from '../types/phone';

interface StorageData<T> {
  value: T;
  expires: number | null;
}

class Storage {
  private fallbackStorage: Map<string, any>;

  constructor() {
    this.fallbackStorage = new Map();
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const data: StorageData<T> = {
      value,
      expires: ttl ? Date.now() + ttl * 1000 : null
    };

    try {
      await set(key, data);
    } catch (error) {
      this.fallbackStorage.set(key, data);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await get(key) as StorageData<T> | undefined;
      const fallbackData = this.fallbackStorage.get(key) as StorageData<T> | undefined;
      
      const storedData = data || fallbackData;
      if (!storedData) return null;

      if (storedData.expires && Date.now() > storedData.expires) {
        await this.delete(key);
        return null;
      }

      return storedData.value;
    } catch (error) {
      const fallbackData = this.fallbackStorage.get(key) as StorageData<T> | undefined;
      return fallbackData ? fallbackData.value : null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await del(key);
      this.fallbackStorage.delete(key);
    } catch (error) {
      this.fallbackStorage.delete(key);
    }
  }

  async clear(): Promise<void> {
    try {
      await clear();
      this.fallbackStorage.clear();
    } catch (error) {
      this.fallbackStorage.clear();
    }
  }

  async getAllPhones(): Promise<Phone[]> {
    try {
      const phones = await this.get<Phone[]>('phones');
      return phones || [];
    } catch (error) {
      console.error('Error getting phones:', error);
      return [];
    }
  }

  async addPhone(phone: Phone): Promise<void> {
    try {
      const phones = await this.getAllPhones();
      phones.push(phone);
      await this.set('phones', phones);
    } catch (error) {
      console.error('Error adding phone:', error);
    }
  }

  async updatePhone(id: string, updatedPhone: Phone): Promise<void> {
    try {
      const phones = await this.getAllPhones();
      const index = phones.findIndex(p => p.id === id);
      if (index !== -1) {
        phones[index] = updatedPhone;
        await this.set('phones', phones);
      }
    } catch (error) {
      console.error('Error updating phone:', error);
    }
  }
}

export const storage = new Storage();