import React from 'react';
import { X } from 'lucide-react';
import { Phone } from '../../types/phone';
import { ComparisonTable } from './ComparisonTable';
import { cn } from '../../lib/utils';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  phones: Phone[];
}

export function ComparisonModal({ isOpen, onClose, phones }: ComparisonModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="sticky top-0 flex items-center justify-between bg-white px-3 sm:px-4 py-3 border-b">
          <h2 className="text-base sm:text-lg font-semibold">Detaylı Karşılaştırma</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-3 sm:p-4">
          <ComparisonTable phones={phones} />
        </div>
      </div>
    </div>
  );
}