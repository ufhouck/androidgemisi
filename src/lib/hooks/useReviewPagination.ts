import { useState, useCallback } from 'react';
import { Review } from '../../types/review';

const REVIEWS_PER_PAGE = 5;

export function useReviewPagination(allReviews: Review[]) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(allReviews.length / REVIEWS_PER_PAGE);
  
  const paginatedReviews = allReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );
  
  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);
  
  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);
  
  return {
    currentPage,
    totalPages,
    paginatedReviews,
    nextPage,
    prevPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1
  };
}