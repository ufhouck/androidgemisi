import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PriceComparisonProps {
  prices: {
    tr: string;
    eu: string;
    us: string;
  };
  trends: {
    tr: number;
    eu: number;
    us: number;
  };
}

export function PriceComparison({ prices, trends }: PriceComparisonProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Fiyat Karşılaştırması</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-500">Türkiye</span>
            <p className="text-lg font-semibold text-orange-600">{prices.tr}</p>
          </div>
          <div className={cn(
            "flex items-center space-x-1",
            trends.tr > 0 ? "text-red-500" : "text-green-500"
          )}>
            {trends.tr > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trends.tr)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-500">Avrupa</span>
            <p className="text-lg font-semibold">{prices.eu}</p>
          </div>
          <div className={cn(
            "flex items-center space-x-1",
            trends.eu > 0 ? "text-red-500" : "text-green-500"
          )}>
            {trends.eu > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trends.eu)}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <span className="text-sm text-gray-500">ABD</span>
            <p className="text-lg font-semibold">{prices.us}</p>
          </div>
          <div className={cn(
            "flex items-center space-x-1",
            trends.us > 0 ? "text-red-500" : "text-green-500"
          )}>
            {trends.us > 0 ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {Math.abs(trends.us)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}