import React from 'react';
import { Filter, Star, Smartphone, ThumbsUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ReviewFiltersProps {
  selectedBrands: string[];
  onBrandChange: (brand: string) => void;
  selectedRatings: number[];
  onRatingChange: (rating: number) => void;
  selectedAspects: string[];
  onAspectChange: (aspect: string) => void;
  brands: string[];
  isMobile?: boolean;
}

export function ReviewFilters({
  selectedBrands,
  onBrandChange,
  selectedRatings,
  onRatingChange,
  selectedAspects,
  onAspectChange,
  brands,
  isMobile = false
}: ReviewFiltersProps) {
  const aspects = [
    'Kamera',
    'Batarya',
    'Performans',
    'Ekran',
    'Tasarım',
    'Fiyat'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-orange-600" />
        <h2 className="font-medium">Yorumları Filtrele</h2>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <h3 className="flex items-center text-sm font-medium text-gray-500 mb-2">
          <Smartphone className="h-4 w-4 mr-1" />
          Markalar
        </h3>
        <div className="flex flex-wrap gap-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => onBrandChange(brand)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                selectedBrands.includes(brand)
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Ratings */}
      <div className="mb-6">
        <h3 className="flex items-center text-sm font-medium text-gray-500 mb-2">
          <Star className="h-4 w-4 mr-1" />
          Puanlar
        </h3>
        <div className="flex flex-wrap gap-2">
          {[5, 4, 3, 2, 1].map(rating => (
            <button
              key={rating}
              onClick={() => onRatingChange(rating)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors",
                selectedRatings.includes(rating)
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              <span>{rating}</span>
              <Star className="h-3 w-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Aspects */}
      <div>
        <h3 className="flex items-center text-sm font-medium text-gray-500 mb-2">
          <ThumbsUp className="h-4 w-4 mr-1" />
          Özellikler
        </h3>
        <div className="flex flex-wrap gap-2">
          {aspects.map(aspect => (
            <button
              key={aspect}
              onClick={() => onAspectChange(aspect)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                selectedAspects.includes(aspect)
                  ? "bg-orange-100 text-orange-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              )}
            >
              {aspect}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}