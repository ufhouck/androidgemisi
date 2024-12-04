import { mockReviews } from '../data/mockReviews';

export async function getAllReviews(phoneModel: string, phoneId: string) {
  // In a real application, this would fetch from an API
  // For now, we'll use mock data
  return Promise.resolve(mockReviews[phoneId] || []);
}