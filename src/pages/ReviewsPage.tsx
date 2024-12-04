import React from 'react';
import { phones } from '../data/phones';
import { getReviewsByPhoneId } from '../data/reviews';
import { ReviewSummaryCard } from '../components/reviews/ReviewSummaryCard';
import { MessageSquareText } from 'lucide-react';

export function ReviewsPage() {
  const allPhoneReviews = phones.map(phone => ({
    phone,
    reviews: getReviewsByPhoneId(phone.id)
  }));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Yapay Zeka Destekli Kullanıcı Yorumları</h1>
        <div className="flex items-center justify-center mb-4">
          <MessageSquareText className="h-6 w-6 text-orange-600 mr-2" />
          <p className="text-lg text-gray-600">
            Farklı platformlardan toplanan kullanıcı deneyimlerini yapay zeka ile analiz ediyoruz
          </p>
        </div>
        <p className="text-gray-500">
          Her telefon için YouTube, Hepsiburada, Trendyol ve N11'den toplanan gerçek kullanıcı yorumlarını
          analiz ederek size tarafsız ve kapsamlı bir değerlendirme sunuyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPhoneReviews.map(({ phone, reviews }) => (
          <ReviewSummaryCard
            key={phone.id}
            reviews={reviews}
            phoneName={phone.name}
          />
        ))}
      </div>
    </main>
  );
}