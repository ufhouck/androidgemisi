import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Phone } from '../../types/phone';
import { slugifyPhoneName } from '../../lib/utils/phoneUtils';
import { cn } from '../../lib/utils';

interface PhoneCardProps {
  phone: Phone;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  disabled?: boolean;
  variant?: 'default' | 'compact';
}

export function PhoneCard({ 
  phone, 
  isSelected, 
  onSelect, 
  disabled,
  variant = 'default'
}: PhoneCardProps) {
  const slug = slugifyPhoneName(phone.name);
  const isMobile = variant === 'compact';

  return (
    <Link
      to={`/telefon/${slug}`}
      className={cn(
        "block bg-white rounded-lg shadow-md hover:shadow-lg transition-all relative",
        isSelected && "ring-2 ring-orange-500"
      )}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className={cn(
              "font-medium text-gray-900 truncate",
              isMobile ? "text-sm" : "text-lg"
            )}>{phone.name}</h3>
            <p className={cn(
              "text-gray-600 truncate",
              isMobile ? "text-xs" : "text-sm"
            )}>{phone.specs.processor}</p>
          </div>
          {onSelect && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onSelect(phone.id);
              }}
              disabled={disabled}
              className={cn(
                "shrink-0 rounded-full transition-colors",
                isSelected 
                  ? "bg-orange-600 text-white hover:bg-orange-700" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
                disabled && "opacity-50 cursor-not-allowed",
                isMobile ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
              )}
            >
              {isSelected ? 'Seçildi' : 'Karşılaştır'}
            </button>
          )}
        </div>

        <div className={cn(
          "flex items-center gap-3 text-gray-500",
          isMobile ? "mt-2 text-xs" : "mt-3 text-sm"
        )}>
          <div className="flex items-center">
            <Star className={cn(
              "text-yellow-400 fill-current mr-1",
              isMobile ? "h-3 w-3" : "h-4 w-4"
            )} />
            <span>{phone.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className={cn(
          "mt-3 font-semibold text-orange-600",
          isMobile ? "text-sm" : "text-xl"
        )}>
          {phone.price.tr}
        </div>
      </div>
    </Link>
  );
}