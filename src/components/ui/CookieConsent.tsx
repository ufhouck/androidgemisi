import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50 p-4 md:p-6">
      <div className="container mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-600">
            Bu web sitesi, size en iyi deneyimi sunmak için çerezleri kullanmaktadır. 
            Sitemizi kullanmaya devam ederek, çerez politikamızı kabul etmiş olursunuz.
          </p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            Kabul Et
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}