import React from 'react';
import { X } from 'lucide-react';

interface FilterChipsProps {
  selectedFilters: { [key: string]: string[] };
  filterLabels: { [key: string]: { [key: string]: string } };
  onRemoveFilter: (filterId: string, value: string) => void;
}

export function FilterChips({ selectedFilters, filterLabels, onRemoveFilter }: FilterChipsProps) {
  const hasActiveFilters = Object.values(selectedFilters).some(filters => filters.length > 0);

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(selectedFilters).map(([filterId, values]) =>
        values.map((value) => (
          <button
            key={`${filterId}-${value}`}
            onClick={() => onRemoveFilter(filterId, value)}
            className="group flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-full text-sm font-medium transition-colors border shadow-sm"
          >
            <span>{filterLabels[filterId]?.[value] || value}</span>
            <X className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
          </button>
        ))
      )}
    </div>
  );
}