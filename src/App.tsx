import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Breadcrumbs } from './components/ui/Breadcrumbs';
import { HomePage } from './pages/HomePage';
import { ComparePage } from './pages/ComparePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { PhoneDetailPage } from './pages/PhoneDetailPage';
import { ScrollToTop } from './lib/scrollToTop';
import { CookieConsent } from './components/ui/CookieConsent';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      <Header />
      <Breadcrumbs />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/karsilastir" element={<ComparePage />} />
          <Route path="/yorumlar" element={<ReviewsPage />} />
          <Route path="/telefon/:slug" element={<PhoneDetailPage />} />
        </Routes>
      </div>
      <Footer />
      <CookieConsent />
    </div>
  );
}