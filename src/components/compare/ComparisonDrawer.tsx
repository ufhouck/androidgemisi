import React from 'react';
import { X, ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { Phone } from '../../types/phone';
import { cn } from '../../lib/utils';
import { ComparisonModal } from './ComparisonModal';
import { getPhoneBasePrice } from '../../lib/services/priceScrapingService';

interface ComparisonDrawerProps {
  selectedPhones: Phone[];
  onRemovePhone: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  variant?: 'default' | 'compact';
}

export function ComparisonDrawer({ 
  selectedPhones, 
  onRemovePhone, 
  isOpen, 
  onToggle,
  variant = 'default'
}: ComparisonDrawerProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const isCompact = variant === 'compact';

  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 border-t border-gray-200 z-40",
        !isOpen && "translate-y-[90%]"
      )}>
        <button
          onClick={onToggle}
          className={cn(
            "absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-600 text-white rounded-t-lg flex items-center space-x-1.5 shadow-lg hover:bg-orange-700",
            isCompact ? "px-2.5 py-1.5 text-xs" : "px-3 sm:px-4 py-2 text-sm"
          )}
        >
          <span>Karşılaştır ({selectedPhones.length})</span>
          {isOpen ? (
            <ChevronDown className={cn(
              isCompact ? "h-3 w-3" : "h-3.5 w-3.5"
            )} />
          ) : (
            <ChevronUp className={cn(
              isCompact ? "h-3 w-3" : "h-3.5 w-3.5"
            )} />
          )}
        </button>
        
        <div className={cn(
          "container mx-auto",
          isCompact ? "px-2 py-2" : "px-2 sm:px-4 py-3"
        )}>
          <div className={cn(
            "flex items-stretch",
            isCompact ? "space-x-1.5" : "sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2"
          )}>
            {selectedPhones.map((phone) => (
              <div key={phone.id} className={cn(
                "flex-1 relative bg-gray-50 rounded-lg",
                isCompact ? "p-2" : "p-2.5"
              )}>
                <button
                  onClick={() => onRemovePhone(phone.id)}
                  className={cn(
                    "absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors",
                    isCompact && "scale-75"
                  )}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div>
                  <h3 className={cn(
                    "font-medium",
                    isCompact ? "text-xs" : "text-sm"
                  )}>{phone.name}</h3>
                  <p className={cn(
                    "text-orange-600 font-semibold mt-0.5",
                    isCompact ? "text-xs" : "text-sm"
                  )}>{getPhoneBasePrice(phone.name)}</p>
                </div>
              </div>
            ))}
            {Array.from({ length: 3 - selectedPhones.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className={cn(
                  "flex-1 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center",
                  isCompact ? "min-h-[52px]" : "min-h-[60px]"
                )}
              >
                <div className="flex flex-col items-center">
                  <Plus className={cn(
                    "text-gray-400",
                    isCompact ? "h-3 w-3" : "h-4 w-4"
                  )} />
                  <p className={cn(
                    "text-gray-400",
                    isCompact ? "text-[10px]" : "text-xs"
                  )}>Telefon Ekle</p>
                </div>
              </div>
            ))}
          </div>
          
          {selectedPhones.length >= 2 && (
            <div className={cn(
              "flex justify-center",
              isCompact ? "mt-3" : "mt-4"
            )}>
              <button
                onClick={() => setIsModalOpen(true)}
                className={cn(
                  "w-full sm:w-auto bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors shadow-md",
                  isCompact ? "text-xs px-4 py-2" : "text-sm px-6 py-2.5"
                )}
              >
                Detaylı Karşılaştır
              </button>
            </div>
          )}
        </div>
      </div>

      <ComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        phones={selectedPhones}
      />
    </>
  );
}