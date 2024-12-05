import React, { memo } from 'react';
import { Star, Tag, ThumbsUp, ThumbsDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Review } from '../../types/review';
import { useReviews } from '../../lib/hooks/useReviews';
import { useReviewPagination } from '../../lib/hooks/useReviewPagination';
import { cn } from '../../lib/utils';

interface ReviewsListProps {
  phoneModel: string;
}

const ReviewItem = memo(({ review }: { review: Review }) => (
  <div 
    className={cn(
      "bg-white rounded-lg shadow-md overflow-hidden",
      review.sentiment === 'positive' && "border-l-4 border-green-500",
      review.sentiment === 'negative' && "border-l-4 border-red-500"
    )}
  >
    <div className="p-6">
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
            <Star
              key={index}
              className={cn(
                "h-5 w-5",
                index < review.rating 
                  ? "text-yellow-400 fill-current" 
                  : "text-gray-300"
              )}
            />
          ))}
        </div>
      </div>

      <p className="text-gray-700 mb-4">{review.comment}</p>

      {review.summary && (
        <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm text-gray-600">
          {review.summary}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>{new Date(review.date).toLocaleDateString('tr-TR')}</span>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 hover:text-orange-600">
            <ThumbsUp className="h-4 w-4" />
            <span>{review.likes}</span>
          </button>
          <button className="flex items-center space-x-1 hover:text-orange-600">
            <ThumbsDown className="h-4 w-4" />
            <span>{review.dislikes}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
));

ReviewItem.displayName = 'ReviewItem';

export function ReviewsList({ phoneModel }: ReviewsListProps) {
  const { reviews, isLoading, error } = useReviews(phoneModel);
  const {
    paginatedReviews,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = useReviewPagination(reviews);

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p>Yorumlar yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    );
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Bu telefon için henüz yorum yapılmamış.
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-6 mb-6">
        {paginatedReviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <button
            onClick={prevPage}
            disabled={!hasPrevPage}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              hasPrevPage 
                ? "text-orange-600 hover:bg-orange-50"
                : "text-gray-400 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Önceki</span>
          </button>
          
          <span className="text-sm text-gray-500">
            Sayfa {currentPage} / {totalPages}
          </span>
          
          <button
            onClick={nextPage}
            disabled={!hasNextPage}
            className={cn(
              "flex items-center gap-1 px-3 py-2 rounded-lg transition-colors",
              hasNextPage 
                ? "text-orange-600 hover:bg-orange-50"
                : "text-gray-400 cursor-not-allowed"
            )}
          >
            <span>Sonraki</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}