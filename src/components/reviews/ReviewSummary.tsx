import React from 'react';
import { Review } from '../../types/review';
import { Star } from 'lucide-react';
import { calculateAverageRating } from '../../lib/utils/reviewUtils';

interface ReviewSummaryProps {
  reviews: Review[];
}

export function ReviewSummary({ reviews }: ReviewSummaryProps) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return null;
  }

  const averageRating = calculateAverageRating(reviews);
  
  const ratingCounts = reviews.reduce((acc, review) => {
    const rating = Math.floor(review.rating);
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as { [key: number]: number });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="text-4xl font-bold text-orange-600">
          {averageRating.toFixed(1)}
        </div>
        <div>
          <div className="flex items-center mb-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`h-5 w-5 ${
                  index < Math.round(averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {reviews.length} değerlendirme
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingCounts[rating] || 0;
          const percentage = (count / reviews.length) * 100;
          
          return (
            <div key={rating} className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 w-12">
                <span>{rating}</span>
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
              </div>
              <div className="flex-1 h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-orange-600 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="w-12 text-sm text-gray-500">
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}