import { Review } from '../types/review';

export const reviews: Review[] = [
  // Samsung Galaxy S24 Ultra Reviews
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
  {
    id: 's24ultra_2',
    phoneId: 's24ultra',
    userName: 'Zeynep K.',
    rating: 4.7,
    comment: 'S Pen kullanımı harika, ekran kalitesi üst düzey. Titanium kasa premium hissettiriyor.',
    likes: 18,
    dislikes: 1,
    date: '2024-03-14'
  },
  // Add more reviews...
];

export function getReviewsByPhoneId(phoneId: string): Review[] {
  return reviews.filter(review => review.phoneId === phoneId);
}

export function addReview(review: Review): void {
  reviews.push(review);
}

export function updateReview(id: string, updatedReview: Review): void {
  const index = reviews.findIndex(r => r.id === id);
  if (index !== -1) {
    reviews[index] = updatedReview;
  }
}

export function deleteReview(id: string): void {
  const index = reviews.findIndex(r => r.id === id);
  if (index !== -1) {
    reviews.splice(index, 1);
  }
}

export function getAverageRating(phoneId: string): number {
  const phoneReviews = getReviewsByPhoneId(phoneId);
  if (phoneReviews.length === 0) return 0;
  
  const sum = phoneReviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / phoneReviews.length).toFixed(1));
}