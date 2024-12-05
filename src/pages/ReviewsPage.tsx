import React, { useState, useEffect } from 'react';
import { phones } from '../data/phones';
import { getAllReviews } from '../services/reviewScraping';
import { ReviewSummaryCard } from '../components/reviews/ReviewSummaryCard';
import { ReviewFilters } from '../components/reviews/ReviewFilters';
import { MessageSquareText, ArrowDownUp } from 'lucide-react';
import { cn } from '../lib/utils';

export function ReviewsPage() {
  const [reviews, setReviews] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedAspects, setSelectedAspects] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'rating' | 'date'>('rating');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    async function fetchReviews() {
      const reviewsData: { [key: string]: any } = {};
      for (const phone of phones) {
        reviewsData[phone.id] = await getAllReviews(phone.name);
      }
      setReviews(reviewsData);
      setIsLoading(false);
    }

    fetchReviews();
  }, []);

  const brands = Array.from(new Set(phones.map(phone => phone.name.split(' ')[0])));

  const filteredPhones = phones.filter(phone => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(phone.name.split(' ')[0])) {
      return false;
    }
    return true;
  });

  const handleBrandChange = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleAspectChange = (aspect: string) => {
    setSelectedAspects(prev =>
      prev.includes(aspect)
        ? prev.filter(a => a !== aspect)
        : [...prev, aspect]
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Yorumlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-4">
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h1 className={cn(
          "font-bold mb-3",
          isMobile ? "text-xl" : "text-2xl sm:text-3xl"
        )}>Yapay Zeka Destekli Kullanıcı Yorumları</h1>
        <div className="flex items-center justify-center mb-3">
          <MessageSquareText className="h-6 w-6 text-orange-600 mr-2" />
          <p className={cn(
            "text-gray-600",
            isMobile ? "text-sm" : "text-lg"
          )}>
            Farklı platformlardan toplanan kullanıcı deneyimlerini yapay zeka ile analiz ediyoruz
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters */}
          <div className="lg:w-64 flex-none">
            <ReviewFilters
              selectedBrands={selectedBrands}
              onBrandChange={handleBrandChange}
              selectedRatings={selectedRatings}
              onRatingChange={handleRatingChange}
              selectedAspects={selectedAspects}
              onAspectChange={handleAspectChange}
              brands={brands}
              isMobile={isMobile}
            />
          </div>

          {/* Reviews Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {filteredPhones.length} telefon listeleniyor
              </p>
              <button
                onClick={() => setSortBy(prev => prev === 'rating' ? 'date' : 'rating')}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-orange-600"
              >
                <ArrowDownUp className="h-4 w-4" />
                <span>{sortBy === 'rating' ? 'Puana Göre' : 'Tarihe Göre'}</span>
              </button>
            </div>

            <div className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}>
              {filteredPhones
                .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : 0)
                .map((phone) => (
                  <ReviewSummaryCard
                    key={phone.id}
                    reviews={reviews[phone.id] || []}
                    phoneName={phone.name}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}