import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Phone } from '../../types/phone';
import { cn } from '../../lib/utils';

interface PhoneCardProps {
  phone: Phone;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
  variant?: 'default' | 'compact';
}

export function PhoneCard({ phone, isSelected, onSelect, disabled, variant = 'default' }: PhoneCardProps) {
  const isCompact = variant === 'compact';

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-col",
        isSelected && "ring-2 ring-orange-500",
        disabled && "opacity-50"
      )}
    >
      <div className={cn(
        "flex-1",
        isCompact ? "p-3" : "p-4"
      )}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <Link 
              to={`/telefon/${slugify(phone.name)}`}
              className={cn(
                "font-semibold hover:text-orange-600 transition-colors",
                isCompact ? "text-sm" : "text-lg"
              )}
            >
              {phone.name}
            </Link>
            <div className="flex items-center mt-1">
              <Star className={cn(
                "text-yellow-400 fill-current",
                isCompact ? "h-3 w-3" : "h-4 w-4"
              )} />
              <span className={cn(
                "ml-1 text-gray-600",
                isCompact ? "text-xs" : "text-sm"
              )}>{phone.rating}</span>
            </div>
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-2 gap-3 mb-4",
          isCompact ? "gap-2 mb-3" : "gap-3 mb-4"
        )}>
          <div className="space-y-1">
            <p className={cn(
              "font-medium text-gray-500",
              isCompact ? "text-xs" : "text-sm"
            )}>İşlemci</p>
            <p className={cn(
              isCompact ? "text-xs" : "text-sm"
            )}>{phone.specs.processor}</p>
          </div>
          <div className="space-y-1">
            <p className={cn(
              "font-medium text-gray-500",
              isCompact ? "text-xs" : "text-sm"
            )}>RAM</p>
            <p className={cn(
              isCompact ? "text-xs" : "text-sm"
            )}>{phone.specs.ram}</p>
          </div>
          <div className="space-y-1">
            <p className={cn(
              "font-medium text-gray-500",
              isCompact ? "text-xs" : "text-sm"
            )}>Depolama</p>
            <p className={cn(
              isCompact ? "text-xs" : "text-sm"
            )}>{phone.specs.storage}</p>
          </div>
          <div className="space-y-1">
            <p className={cn(
              "font-medium text-gray-500",
              isCompact ? "text-xs" : "text-sm"
            )}>Batarya</p>
            <p className={cn(
              isCompact ? "text-xs" : "text-sm"
            )}>{phone.specs.battery}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {phone.colors.map((color) => (
            <span key={color} className={cn(
              "bg-gray-100 text-gray-700 rounded-full",
              isCompact ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"
            )}>
              {color}
            </span>
          ))}
        </div>
      </div>

      <div className={cn(
        "bg-gray-50 mt-auto",
        isCompact ? "p-3" : "p-4"
      )}>
        <div className="flex items-center justify-between">
          <span className={cn(
            "font-bold text-orange-600",
            isCompact ? "text-base" : "text-xl"
          )}>{phone.price.tr}</span>
          <button 
            onClick={() => onSelect(phone.id)}
            disabled={disabled && !isSelected}
            className={cn(
              "rounded-full transition-colors font-medium",
              isCompact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
              isSelected 
                ? "bg-red-100 text-red-600 hover:bg-red-200"
                : "bg-orange-100 text-orange-600 hover:bg-orange-200",
              disabled && !isSelected && "cursor-not-allowed opacity-50"
            )}
          >
            {isSelected ? 'Kaldır' : 'Karşılaştır'}
          </button>
        </div>
      </div>
    </div>
  );
}