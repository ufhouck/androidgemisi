import { Review } from '../../../types/review';
import { reviewTemplates } from './reviewTemplates';
import { determinePhoneTier } from '../../utils/priceUtils';

const USER_NAMES = [
  'Teknoloji Meraklısı',
  'Mobil Uzmanı',
  'Android Kullanıcısı',
  'Fotoğraf Tutkunu',
  'Oyun Sever',
  'Günlük Kullanıcı',
  'Tech Reviewer',
  'Profesyonel Kullanıcı'
];

function generateRandomDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateReviews(phoneModel: string, brand: string): Review[] {
  const tier = determinePhoneTier(brand, phoneModel);
  const templates = reviewTemplates[tier];
  const reviews: Review[] = [];
  const usedTemplates = new Set<string>();
  const usedUserNames = new Set<string>();

  templates.forEach(aspectGroup => {
    aspectGroup.templates.forEach(template => {
      if (!usedTemplates.has(template.comment)) {
        let userName;
        do {
          userName = USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)];
        } while (usedUserNames.has(userName));

        usedTemplates.add(template.comment);
        usedUserNames.add(userName);

        reviews.push({
          id: `${phoneModel}_${reviews.length}`,
          phoneId: phoneModel.toLowerCase().replace(/[^a-z0-9]+/g, ''),
          userName,
          rating: template.rating,
          comment: template.comment,
          likes: Math.floor(Math.random() * 50),
          dislikes: Math.floor(Math.random() * 10),
          date: generateRandomDate(90),
          aspects: aspectGroup.aspects,
          sentiment: template.sentiment
        });
      }
    });
  });

  return shuffleArray(reviews).sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}