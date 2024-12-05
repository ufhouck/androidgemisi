import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Review } from '../../types/review';
import { generateReviewSummary } from '../../lib/reviewAnalysis';

interface ReviewSummaryCardProps {
  reviews: Review[];
  phoneName: string;
}

export function ReviewSummaryCard({ reviews, phoneName }: ReviewSummaryCardProps) {
  const summary = generateReviewSummary(Array.isArray(reviews) ? reviews : [], phoneName);
  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <Link 
      to={`/telefon/${slugify(phoneName)}`}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <h3 className="text-xl font-semibold mb-4">{phoneName}</h3>
      
      <p className="text-gray-600 mb-4">
        {summary.overallSentiment} ({summary.totalReviews} yorum)
      </p>
      
      {summary.positiveAspects.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center text-green-600 mb-2">
            <ThumbsUp className="h-4 w-4 mr-2" />
            <span className="font-medium">Öne Çıkan Olumlu Yönler</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {summary.positiveAspects.map((aspect, index) => (
              <li key={index}>• {aspect}</li>
            ))}
          </ul>
        </div>
      )}
      
      {summary.negativeAspects.length > 0 && (
        <div>
          <div className="flex items-center text-red-600 mb-2">
            <ThumbsDown className="h-4 w-4 mr-2" />
            <span className="font-medium">Geliştirilebilir Yönler</span>
          </div>
          <ul className="text-sm text-gray-600 space-y-1">
            {summary.negativeAspects.map((aspect, index) => (
              <li key={index}>• {aspect}</li>
            ))}
          </ul>
        </div>
      )}
    </Link>
  );
}