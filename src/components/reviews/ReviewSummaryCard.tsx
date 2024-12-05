import React from 'react';
import { Link } from 'react-router-dom';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Review } from '../../types/review';
import { generateReviewSummary } from '../../lib/reviewAnalysis';
import { cn } from '../../lib/utils';

interface ReviewSummaryCardProps {
  reviews: Review[];
  phoneName: string;
}

export function ReviewSummaryCard({ reviews, phoneName }: ReviewSummaryCardProps) {
  const summary = generateReviewSummary(Array.isArray(reviews) ? reviews : [], phoneName);
  const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <Link 
      to={`/telefon/${slugify(phoneName)}`}
      className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
    >
      <h3 className={cn(
        "font-semibold mb-4",
        isMobile ? "text-lg" : "text-xl"
      )}>{phoneName}</h3>
      
      <p className={cn(
        "text-gray-600 mb-4",
        isMobile ? "text-sm" : "text-base"
      )}>
        {summary.overallSentiment} ({summary.totalReviews} yorum)
      </p>
      
      {summary.positiveAspects.length > 0 && (
        <div className="mb-3">
          <div className="flex items-center text-green-600 mb-2">
            <ThumbsUp className={cn(
              "mr-2",
              isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
            )} />
            <span className={cn(
              "font-medium",
              isMobile ? "text-sm" : "text-base"
            )}>Öne Çıkan Olumlu Yönler</span>
          </div>
          <ul className={cn(
            "text-gray-600 space-y-1",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {summary.positiveAspects.map((aspect, index) => (
              <li key={index}>• {aspect}</li>
            ))}
          </ul>
        </div>
      )}
      
      {summary.negativeAspects.length > 0 && (
        <div>
          <div className="flex items-center text-red-600 mb-2">
            <ThumbsDown className={cn(
              "mr-2",
              isMobile ? "h-3.5 w-3.5" : "h-4 w-4"
            )} />
            <span className={cn(
              "font-medium",
              isMobile ? "text-sm" : "text-base"
            )}>Geliştirilebilir Yönler</span>
          </div>
          <ul className={cn(
            "text-gray-600 space-y-1",
            isMobile ? "text-xs" : "text-sm"
          )}>
            {summary.negativeAspects.map((aspect, index) => (
              <li key={index}>• {aspect}</li>
            ))}
          </ul>
        </div>
      )}
    </Link>
  );
}