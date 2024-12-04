import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { phones } from '../data/phones';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import { cn } from '../lib/utils';
import { ReviewsList } from '../components/reviews/ReviewsList';
import { ReviewSummary } from '../components/reviews/ReviewSummary';
import { getReviewsByPhoneId } from '../data/reviews';

export function PhoneDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const phone = phones.find(p => slugify(p.name) === slug);

  if (!phone) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Telefon bulunamadı</h1>
      </div>
    );
  }

  const reviews = getReviewsByPhoneId(phone.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{phone.name}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{phone.rating}</span>
              </div>
              <span className="text-gray-500">
                Çıkış: {new Date(phone.releaseDate).toLocaleDateString('tr-TR')}
              </span>
            </div>
            <div className="text-xl font-bold text-orange-600">
              {phone.price.tr}
            </div>
          </div>

          <div className="space-y-4">
            {/* Specifications Section */}
            <div className="border rounded-lg">
              <button
                onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                className="w-full flex items-center justify-between p-4 font-medium text-left"
              >
                <span>Teknik Özellikler</span>
                {isSpecsOpen ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              <div className={cn("border-t p-4", !isSpecsOpen && "hidden")}>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">İşlemci</dt>
                    <dd className="mt-1">{phone.specs.processor}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">RAM</dt>
                    <dd className="mt-1">{phone.specs.ram}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Depolama</dt>
                    <dd className="mt-1">{phone.specs.storage}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Kamera</dt>
                    <dd className="mt-1">{phone.specs.camera}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Batarya</dt>
                    <dd className="mt-1">{phone.specs.battery}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Ekran</dt>
                    <dd className="mt-1">{phone.specs.screen}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Kullanıcı Yorumları</h2>
              <ReviewSummary reviews={reviews} />
              <ReviewsList reviews={reviews} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}