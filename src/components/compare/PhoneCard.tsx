import React from 'react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Phone } from '../../types/phone';
import { cn } from '../../lib/utils';
import { colors } from '../../lib/colors';

interface PhoneCardProps {
  phone: Phone;
  isSelected: boolean;
  onSelect: (id: string) => void;
  disabled: boolean;
}

export function PhoneCard({ phone, isSelected, onSelect, disabled }: PhoneCardProps) {
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
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link 
              to={`/telefon/${slugify(phone.name)}`}
              className="text-lg font-semibold hover:text-orange-600 transition-colors"
            >
              {phone.name}
            </Link>
            <div className="flex items-center mt-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">{phone.rating}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">İşlemci</p>
            <p className="text-sm">{phone.specs.processor}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">RAM</p>
            <p className="text-sm">{phone.specs.ram}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Depolama</p>
            <p className="text-sm">{phone.specs.storage}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Batarya</p>
            <p className="text-sm">{phone.specs.battery}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {phone.colors.map((color) => (
            <span key={color} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {color}
            </span>
          ))}
        </div>
      </div>

      <div className="p-6 bg-gray-50 mt-auto">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-orange-600">{phone.price.tr}</span>
          <button 
            onClick={() => onSelect(phone.id)}
            disabled={disabled && !isSelected}
            className={cn(
              "px-6 py-2 rounded-full transition-colors text-sm font-medium",
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