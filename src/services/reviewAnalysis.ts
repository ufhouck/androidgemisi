import { GoogleGenerativeAI } from '@google/generative-ai';
import { Review } from '../types/review';
import { cache } from '../lib/cache';
import { CACHE_KEYS, CACHE_DURATIONS, generateCacheKey } from '../lib/utils/cacheUtils';

const genAI = new GoogleGenerativeAI('AIzaSyC_12a4ST7GT36dZtwSRRy3-HBNvsB3g7c');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'default_1',
    phoneId: '',
    userName: 'Teknoloji Uzmanı',
    rating: 4.5,
    comment: 'Genel olarak başarılı bir telefon. Kamera performansı ve pil ömrü tatmin edici.',
    likes: 15,
    dislikes: 2,
    date: new Date().toISOString(),
    aspects: ['Kamera', 'Batarya']
  }
];

async function analyzeWithGemini(phoneModel: string): Promise<Review[]> {
  try {
    const prompt = `
      Analyze and generate 5 detailed user reviews in Turkish for the ${phoneModel} smartphone.
      Return the response in the following JSON format:
      [
        {
          "rating": number between 1-5,
          "comment": "detailed review in Turkish",
          "aspects": ["feature1", "feature2"]
        }
      ]
      Focus on: camera quality, battery life, performance, display quality, build quality, value for money.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsedReviews = JSON.parse(text);
      if (!Array.isArray(parsedReviews)) {
        throw new Error('Invalid response format');
      }

      return parsedReviews.map((review: any, index: number) => ({
        id: `gemini_${phoneModel}_${index}`,
        phoneId: phoneModel.toLowerCase().replace(/[^a-z0-9]+/g, ''),
        userName: `Teknoloji Uzmanı ${index + 1}`,
        rating: Number(review.rating) || 4,
        comment: review.comment || 'Değerlendirme mevcut değil',
        likes: Math.floor(Math.random() * 20),
        dislikes: Math.floor(Math.random() * 5),
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        aspects: Array.isArray(review.aspects) ? review.aspects : []
      }));
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      return DEFAULT_REVIEWS;
    }
  } catch (error) {
    console.error('Error generating reviews with Gemini:', error);
    return DEFAULT_REVIEWS;
  }
}

export async function getPhoneReviews(phoneModel: string): Promise<Review[]> {
  const cacheKey = generateCacheKey(CACHE_KEYS.REVIEWS, phoneModel);
  
  try {
    // Check cache first
    const cachedReviews = await cache.get<Review[]>(cacheKey);
    if (cachedReviews && Array.isArray(cachedReviews) && cachedReviews.length > 0) {
      return cachedReviews;
    }

    // Generate new reviews
    const reviews = await analyzeWithGemini(phoneModel);
    
    if (reviews.length > 0) {
      await cache.set(cacheKey, reviews, CACHE_DURATIONS.LONG);
    }

    return reviews;
  } catch (error) {
    console.error('Error in getPhoneReviews:', error);
    return DEFAULT_REVIEWS;
  }
}