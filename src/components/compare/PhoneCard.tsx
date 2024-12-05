import React, { useState } from 'react';
import { Star, Plus, Check, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Phone } from '../../types/phone';
import { cn } from '../../lib/utils';
import { getPhonePrices } from '../../lib/services/priceScrapingService';

interface PhoneCardProps {
  phone: Phone;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

export function PhoneCard({ 
  phone, 
  isSelected, 
  onSelect, 
  disabled = false,
  variant = 'default'
}: PhoneCardProps) {
  const [showPrices, setShowPrices] = useState(false);
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isCompact = variant === 'compact';
  const slug = phone.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  const handlePriceHover = async () => {
    if (!prices.length && !isLoading) {
      setIsLoading(true);
      const priceData = await getPhonePrices(phone.name);
      setPrices(priceData);
      setIsLoading(false);
    }
    setShowPrices(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If clicking the select button or price links, don't navigate
    if ((e.target as HTMLElement).closest('button') || 
        (e.target as HTMLElement).closest('a')) {
      return;
    }
    window.location.href = `/telefon/${slug}`;
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "group relative bg-white rounded-lg border transition-all cursor-pointer",
        isSelected 
          ? "border-orange-500 shadow-md" 
          : "border-gray-200 hover:border-orange-300 hover:shadow-md",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {/* Selection Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          !disabled && onSelect(phone.id);
        }}
        disabled={disabled}
        className={cn(
          "absolute right-3 top-3 rounded-full transition-colors z-10",
          isSelected 
            ? "bg-orange-600 text-white" 
            : "bg-gray-100 text-gray-400 group-hover:bg-orange-50 group-hover:text-orange-600",
          isCompact ? "p-1" : "p-1.5"
        )}
      >
        {isSelected ? (
          <Check className={cn(
            isCompact ? "h-3 w-3" : "h-4 w-4"
          )} />
        ) : (
          <Plus className={cn(
            isCompact ? "h-3 w-3" : "h-4 w-4"
          )} />
        )}
      </button>

      {/* Content */}
      <div className={cn(
        isCompact ? "p-3" : "p-4"
      )}>
        <h3 className={cn(
          "font-medium mb-1 pr-8",
          isCompact ? "text-sm" : "text-base"
        )}>{phone.name}</h3>

        <div className={cn(
          "flex items-center gap-2 text-gray-500 mb-3",
          isCompact ? "text-xs" : "text-sm"
        )}>
          <div className="flex items-center">
            <Star className={cn(
              "text-yellow-400 fill-current mr-1",
              isCompact ? "h-3 w-3" : "h-4 w-4"
            )} />
            <span>{phone.rating}</span>
          </div>
          <span>•</span>
          <span>{new Date(phone.releaseDate).toLocaleDateString('tr-TR')}</span>
        </div>

        <div className="space-y-2">
          {/* Specs */}
          <div className={cn(
            "space-y-1",
            isCompact ? "text-xs" : "text-sm"
          )}>
            <p className="text-gray-600">
              <span className="font-medium">İşlemci:</span> {phone.specs.processor}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">RAM:</span> {phone.specs.ram}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Depolama:</span> {phone.specs.storage}
            </p>
          </div>

          {/* Price */}
          <div className={cn(
            "pt-2 border-t relative",
            isCompact ? "text-sm" : "text-base"
          )}>
            <div 
              className="relative"
              onMouseEnter={handlePriceHover}
              onMouseLeave={() => setShowPrices(false)}
            >
              <span className={cn(
                "font-bold text-orange-600",
                isCompact ? "text-sm" : "text-xl"
              )}>{phone.price.tr}</span>

              {/* Price Tooltip */}
              {showPrices && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 p-3 z-20">
                  <div className="space-y-2">
                    {isLoading ? (
                      <p className="text-sm text-gray-500">Fiyatlar yükleniyor...</p>
                    ) : (
                      prices.map((price) => (
                        <div key={price.store} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{price.store}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{price.price}</span>
                            <a
                              href={price.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}