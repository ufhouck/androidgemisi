import React from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Review } from '../../types/review';

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Bu telefon için henüz yorum yapılmamış.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold">{review.userName}</h3>
            </div>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <span
                  key={index}
                  className={`text-lg ${
                    index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-700 mb-4">{review.comment}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-orange-600">
                <ThumbsUp className="h-4 w-4" />
                <span>{review.likes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-red-600">
                <ThumbsDown className="h-4 w-4" />
                <span>{review.dislikes}</span>
              </button>
              <button className="flex items-center space-x-1 hover:text-gray-700">
                <MessageCircle className="h-4 w-4" />
                <span>Yanıtla</span>
              </button>
            </div>
            <span>{new Date(review.date).toLocaleDateString('tr-TR')}</span>
          </div>
        </div>
      ))}
    </div>
  );
}