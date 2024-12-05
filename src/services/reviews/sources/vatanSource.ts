import { Review } from '../../../types/review';
import { got } from 'got-scraping';
import * as cheerio from 'cheerio';
import { analyzeSentiment } from '../sentiment';
import { extractAspects } from '../aspects';
import { normalizeText } from '../../../lib/utils/textUtils';

export async function vatanReviews(model: string): Promise<Review[]> {
  try {
    const searchUrl = `https://www.vatanbilgisayar.com/arama/${encodeURIComponent(model)}`;
    const response = await got(searchUrl);
    const $ = cheerio.load(response.body);

    // Ürün sayfasını bul
    const productUrl = $('.product-list__content').first().find('a').attr('href');
    if (!productUrl) return [];

    // Ürün yorumları sayfasına git
    const reviewsResponse = await got(`https://www.vatanbilgisayar.com${productUrl}/yorumlar`);
    const $reviews = cheerio.load(reviewsResponse.body);

    const reviews: Review[] = [];

    $reviews('.comment-item').each((_, element) => {
      const comment = $reviews(element).find('.comment-text').text().trim();
      const ratingStars = $reviews(element).find('.rating-star.active').length;
      const userName = $reviews(element).find('.username').text().trim();
      const date = $reviews(element).find('.comment-date').text().trim();

      if (comment && ratingStars) {
        const normalizedComment = normalizeText(comment);
        const sentiment = analyzeSentiment(normalizedComment);
        const aspects = extractAspects(normalizedComment);

        reviews.push({
          id: `vatan_${reviews.length}`,
          phoneId: model.toLowerCase().replace(/[^a-z0-9]+/g, ''),
          userName: userName || 'Vatan Kullanıcısı',
          rating: ratingStars,
          comment: normalizedComment,
          likes: 0,
          dislikes: 0,
          date: new Date(date).toISOString(),
          aspects,
          sentiment,
          source: 'vatan'
        });
      }
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching Vatan reviews:', error);
    return [];
  }
}