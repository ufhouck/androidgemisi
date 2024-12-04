import React from 'react';
import { X } from 'lucide-react';
import { Phone } from '../../data/phones';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-50 w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
        <div className="sticky top-0 flex items-center justify-between bg-white px-4 sm:px-6 py-4 border-b">
          <h2 className="text-lg sm:text-xl font-semibold">Detaylı Karşılaştırma</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <ComparisonTable phones={phones} />
        </div>
      </div>
    </div>
  );
}