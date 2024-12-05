import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Loader2, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getPhonePrices, findBestPrice } from '../../lib/services/priceScrapingService';

interface PriceComparisonProps {
  model: string;
}

export function PriceComparison({ model }: PriceComparisonProps) {
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrices() {
      try {
        const priceData = await getPhonePrices(model);
        setPrices(priceData);
      } catch (err) {
        setError('Fiyatlar yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPrices();
  }, [model]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
        <span className="ml-2">Fiyatlar yükleniyor...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const bestPrice = findBestPrice(prices);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">En Uygun Fiyatlar</h3>
      <div className="space-y-4">
        {prices.map((price, index) => (
          <div 
            key={price.store} 
            className={cn(
              "flex items-center justify-between p-4 rounded-lg",
              bestPrice?.store === price.store ? "bg-green-50" : "bg-gray-50"
            )}
          >
            <div>
              <span className="text-sm text-gray-500">{price.store}</span>
              <p className={cn(
                "text-lg font-semibold",
                bestPrice?.store === price.store ? "text-green-600" : ""
              )}>
                {price.price}
              </p>
            </div>
            <a
              href={price.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm text-blue-600 hover:text-blue-700"
            >
              Satın Al
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>
        ))}

        {prices.length === 0 && (
          <p className="text-center text-gray-500">
            Şu anda fiyat bilgisi bulunamadı
          </p>
        )}
      </div>
    </div>
  );
}