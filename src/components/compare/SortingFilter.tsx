import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SortingFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortingFilter({ value, onChange }: SortingFilterProps) {
  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="h-4 w-4 text-gray-500" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white border border-gray-200 rounded-lg text-sm py-1.5 pl-2 pr-8 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
      >
        <option value="">Sıralama</option>
        <option value="price-asc">En Düşük Fiyat</option>
        <option value="price-desc">En Yüksek Fiyat</option>
        <option value="rating-desc">En Yüksek Puan</option>
        <option value="rating-asc">En Düşük Puan</option>
      </select>
    </div>
  );
}