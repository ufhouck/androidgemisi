import { set, get, del, clear } from 'idb-keyval';

class Storage {
  async set(key: string, value: any, ttl?: number): Promise<void> {
    const data = {
      value,
      expires: ttl ? Date.now() + ttl * 1000 : null
    };
    await set(key, data);
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await get(key);
      if (!data) return null;

      if (data.expires && Date.now() > data.expires) {
        await del(key);
        return null;
      }

      return data.value as T;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    await del(key);
  }

  async clear(): Promise<void> {
    await clear();
  }

  // Yeni eklenen metodlar
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