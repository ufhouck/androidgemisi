import React from 'react';
import { PriceHistory } from '../components/price/PriceHistory';
import { PriceComparison } from '../components/price/PriceComparison';
import { phones } from '../data/phones';

// Mock data for price history
const mockPriceHistory = {
  dates: ['1 Ocak', '1 Şubat', '1 Mart', '15 Mart'],
  prices: {
    tr: [84999, 82999, 83999, 84999],
    eu: [1449, 1399, 1429, 1449],
    us: [1299, 1249, 1279, 1299]
  }
};

// Mock data for price trends
const mockTrends = {
  tr: 2.4,
  eu: -1.2,
  us: 1.5
};

export function PriceAnalysisPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">Fiyat Analizi</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PriceHistory 
          phoneId={phones[0].id} 
          data={mockPriceHistory} 
        />
        <PriceComparison 
          prices={phones[0].price}
          trends={mockTrends}
        />
      </div>
    </main>
  );
}