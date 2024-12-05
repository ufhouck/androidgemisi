import { set, get, del, clear } from 'idb-keyval';

class Storage {
  private fallbackStorage: Map<string, any>;

  constructor() {
    this.fallbackStorage = new Map();
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    const data = {
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
      const data = await get(key) || this.fallbackStorage.get(key);
      if (!data) return null;

      if (data.expires && Date.now() > data.expires) {
        await this.delete(key);
        return null;
      }

      return data.value as T;
    } catch (error) {
      const data = this.fallbackStorage.get(key);
      return data ? data.value as T : null;
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

  async getAllPhones(): Promise<any[]> {
    try {
      const phones = await this.get<any[]>('phones') || [];
      return phones;
    } catch (error) {
      console.error('Error getting phones:', error);
      return [];
    }
  }

  async addPhone(phone: any): Promise<void> {
    try {
      const phones = await this.getAllPhones();
      phones.push(phone);
      await this.set('phones', phones);
    } catch (error) {
      console.error('Error adding phone:', error);
    }
  }

  async updatePhone(id: string, updatedPhone: any): Promise<void> {
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