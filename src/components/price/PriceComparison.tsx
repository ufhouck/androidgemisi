import React, { useState, useEffect } from 'react';
import { ExternalLink, RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { getPhonePrices } from '../../lib/services/priceScrapingService';

interface PriceComparisonProps {
  model: string;
}

export function PriceComparison({ model }: PriceComparisonProps) {
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Format model name for sahibinden.com URL
  const formatSahibindenUrl = (model: string) => {
    const [brand, ...modelParts] = model.split(' ');
    const modelName = modelParts.join('-').toLowerCase();
    const queryText = encodeURIComponent(model.replace(/ /g, '+'));
    return `https://www.sahibinden.com/cep-telefonu-modeller-${brand.toLowerCase()}-${modelName}?query_text_mf=${queryText}&query_text=${queryText}`;
  };

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className={cn(
        "font-semibold mb-4",
        isMobile ? "text-lg" : "text-xl"
      )}>En Uygun Fiyatlar</h3>
      <div className="space-y-4">
        {/* E-ticaret Siteleri */}
        {prices.map((price, index) => (
          <div 
            key={price.store} 
            className={cn(
              "flex items-center justify-between p-4 rounded-lg",
              index === 0 ? "bg-green-50" : "bg-gray-50"
            )}
          >
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">{price.store}</span>
                <p className={cn(
                  "text-lg font-semibold",
                  index === 0 ? "text-green-600" : ""
                )}>
                  {price.price}
                </p>
              </div>
              {price.hasTrade && (
                <div className="flex items-center text-xs text-gray-500">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  <span>Takas</span>
                </div>
              )}
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

        {/* Fiyat Karşılaştırma Siteleri */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Fiyat Karşılaştırma</h4>
          <div className="space-y-2">
            {[
              { name: 'Cimri', url: `https://www.cimri.com/arama?q=${encodeURIComponent(model)}` },
              { name: 'Akakçe', url: `https://www.akakce.com/arama/?q=${encodeURIComponent(model)}` },
              { name: 'Epey', url: `https://www.epey.com/ara/${encodeURIComponent(model)}` }
            ].map(site => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm text-gray-600">{site.name}</span>
                <ExternalLink className="h-4 w-4 text-gray-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Sahibinden */}
        <div className="pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-500 mb-3">İkinci El</h4>
          <a
            href={formatSahibindenUrl(model)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm text-gray-600">sahibinden.com</span>
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </a>
        </div>

        {prices.length === 0 && (
          <p className="text-center text-gray-500">
            Şu anda fiyat bilgisi bulunamadı
          </p>
        )}
      </div>
    </div>
  );
}