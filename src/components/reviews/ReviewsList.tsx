import React from 'react';
import { Star, Tag } from 'lucide-react';
import { Review } from '../../types/review';
import { sortReviewsByDate } from '../../lib/utils/reviewUtils';
import { cn } from '../../lib/utils';

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Bu telefon için henüz yorum yapılmamış.
      </div>
    );
  }

  const sortedReviews = sortReviewsByDate(reviews);

  return (
    <div className="space-y-6">
      {sortedReviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold">{review.userName}</h3>
              {review.aspects && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {review.aspects.map((aspect, i) => (
                    <span 
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded-full bg-orange-50 text-orange-600 text-xs"
                    >
                      <Tag className="h-3 w-3 mr-1" />
                      {aspect}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "text-lg",
                    index < review.rating ? "text-yellow-400" : "text-gray-300"
                  )}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700 mb-4">{review.comment}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{new Date(review.date).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}