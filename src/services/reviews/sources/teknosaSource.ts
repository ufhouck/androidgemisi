import { Review } from '../../../types/review';
import { got } from 'got-scraping';
import * as cheerio from 'cheerio';
import { analyzeSentiment } from '../sentiment';
import { extractAspects } from '../aspects';
import { normalizeText } from '../../../lib/utils/textUtils';

export async function teknosaReviews(model: string): Promise<Review[]> {
  try {
    const searchUrl = `https://www.teknosa.com/arama/?s=${encodeURIComponent(model)}`;
    const response = await got(searchUrl);
    const $ = cheerio.load(response.body);

    // Ürün sayfasını bul
    const productUrl = $('.product-card').first().find('a').attr('href');
    if (!productUrl) return [];

    // Ürün yorumları sayfasına git
    const reviewsResponse = await got(`https://www.teknosa.com${productUrl}`);
    const $reviews = cheerio.load(reviewsResponse.body);

    const reviews: Review[] = [];

    $reviews('.review-item').each((_, element) => {
      const comment = $reviews(element).find('.review-text').text().trim();
      const ratingText = $reviews(element).find('.rating-stars').attr('data-rating') || '0';
      const rating = parseInt(ratingText);
      const userName = $reviews(element).find('.reviewer-name').text().trim();
      const date = $reviews(element).find('.review-date').text().trim();

      if (comment && rating) {
        const normalizedComment = normalizeText(comment);
        const sentiment = analyzeSentiment(normalizedComment);
        const aspects = extractAspects(normalizedComment);

        reviews.push({
          id: `teknosa_${reviews.length}`,
          phoneId: model.toLowerCase().replace(/[^a-z0-9]+/g, ''),
          userName: userName || 'Teknosa Kullanıcısı',
          rating: Math.min(Math.max(rating, 1), 5),
          comment: normalizedComment,
          likes: 0,
          dislikes: 0,
          date: new Date(date).toISOString(),
          aspects,
          sentiment,
          source: 'teknosa'
        });
      }
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching Teknosa reviews:', error);
    return [];
  }
}