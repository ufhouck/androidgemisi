import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { ComparePage } from './pages/ComparePage';
import { ReviewsPage } from './pages/ReviewsPage';
import { PhoneDetailPage } from './pages/PhoneDetailPage';
import { ScrollToTop } from './lib/scrollToTop';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ScrollToTop />
      <Header />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/karsilastir" element={<ComparePage />} />
          <Route path="/yorumlar" element={<ReviewsPage />} />
          <Route path="/telefon/:slug" element={<PhoneDetailPage />} />
        </Routes>
      </div>
      
      <footer className="bg-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Android Gemisi</h3>
              <p className="text-gray-400 text-sm">
                Android telefonları karşılaştırın, en uygun fiyatları bulun ve kullanıcı deneyimlerini inceleyin.
              </p>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-center text-gray-400 text-sm">
              © {new Date().getFullYear()} AndroidGemisi. Tüm hakları saklıdır.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}