import { mockNews } from '../data/mockNews';

export async function getLatestNews() {
  // In a real application, this would fetch from an API
  // For now, we'll use mock data
  return Promise.resolve(mockNews);
}