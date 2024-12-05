import { Phone } from '../types/phone';

// In-memory storage for phones
let phones: Phone[] = [];

export function getAllPhones(): Phone[] {
  return phones;
}

export function addPhone(phone: Phone): void {
  phones.push(phone);
}

export function updatePhone(id: string, updatedPhone: Phone): void {
  const index = phones.findIndex(p => p.id === id);
  if (index !== -1) {
    phones[index] = updatedPhone;
  }
}

export function deletePhone(id: string): void {
  phones = phones.filter(p => p.id !== id);
}

// Initialize with some default phones if needed
export function initializePhones(initialPhones: Phone[]): void {
  phones = initialPhones;
}