import { Review } from '../types/review';

export const mockReviews: { [key: string]: Review[] } = {
  's24ultra': [
    {
      id: 's24ultra_1',
      phoneId: 's24ultra',
      userName: 'Ahmet Y.',
      rating: 4.8,
      comment: 'Kamera performansı muhteşem! Özellikle gece çekimleri çok başarılı. Batarya ömrü de bir günü rahat çıkarıyor.',
      likes: 24,
      dislikes: 2,
      date: '2024-03-15'
    },
    // Add more reviews for each phone...
  ],
  // Add reviews for other phones...
};