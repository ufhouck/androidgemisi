import React, { useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Phone } from '../../types/phone';
import { cn } from '../../lib/utils';
import { ComparisonModal } from './ComparisonModal';

interface ComparisonDrawerProps {
  selectedPhones: Phone[];
  onRemovePhone: (id: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function ComparisonDrawer({ selectedPhones, onRemovePhone, isOpen, onToggle }: ComparisonDrawerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-300 border-t border-gray-200 z-40",
        !isOpen && "translate-y-[90%]"
      )}>
        <button
          onClick={onToggle}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-3 sm:px-4 py-1.5 rounded-t-lg flex items-center space-x-1.5 shadow-lg hover:bg-orange-700 text-sm"
        >
          <span>Karşılaştır ({selectedPhones.length})</span>
          {isOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>
        
        <div className="container mx-auto px-2 sm:px-4 py-2">
          <div className="flex flex-col sm:flex-row items-stretch space-y-2 sm:space-y-0 sm:space-x-2">
            {selectedPhones.map((phone) => (
              <div key={phone.id} className="flex-1 relative bg-gray-50 rounded-lg p-2.5">
                <button
                  onClick={() => onRemovePhone(phone.id)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
                <div>
                  <h3 className="font-medium text-sm">{phone.name}</h3>
                  <p className="text-orange-600 font-semibold mt-0.5 text-sm">{phone.price.tr}</p>
                </div>
              </div>
            ))}
            {Array.from({ length: 3 - selectedPhones.length }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="flex-1 border-2 border-dashed border-gray-200 rounded-lg p-2.5 flex items-center justify-center min-h-[60px]"
              >
                <p className="text-gray-400 text-xs">Telefon Ekle</p>
              </div>
            ))}
          </div>
          
          {selectedPhones.length >= 2 && (
            <div className="mt-3 flex justify-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-orange-600 text-white px-4 py-1.5 rounded-full hover:bg-orange-700 transition-colors shadow-md text-sm"
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