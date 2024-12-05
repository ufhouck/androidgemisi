import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Filter, Smartphone, Cpu, HardDrive, Battery, ChevronDown, ChevronUp, Search, X, DollarSign } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface QuickFilter {
  id: string;
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
}

const quickFilters: QuickFilter[] = [
  {
    id: 'price',
    label: 'Fiyat',
    icon: <DollarSign className="h-4 w-4" />,
    options: [
      { value: '0-10000', label: '10.000 ₺ altı' },
      { value: '10000-20000', label: '10.000 ₺ - 20.000 ₺' },
      { value: '20000-30000', label: '20.000 ₺ - 30.000 ₺' },
      { value: '30000-50000', label: '30.000 ₺ - 50.000 ₺' },
      { value: '50000-plus', label: '50.000 ₺ üzeri' },
    ]
  },
  {
    id: 'brand',
    label: 'Marka',
    icon: <Smartphone className="h-4 w-4" />,
    options: [
      { value: 'samsung', label: 'Samsung' },
      { value: 'xiaomi', label: 'Xiaomi' },
      { value: 'google', label: 'Google' },
      { value: 'oneplus', label: 'OnePlus' },
      { value: 'honor', label: 'Honor' },
      { value: 'tecno', label: 'Tecno' },
      { value: 'reeder', label: 'Reeder' },
    ]
  },
  {
    id: 'processor',
    label: 'İşlemci',
    icon: <Cpu className="h-4 w-4" />,
    options: [
      { value: 'snapdragon-8-gen-3', label: 'Snapdragon 8 Gen 3' },
      { value: 'dimensity-9300', label: 'Dimensity 9300' },
      { value: 'tensor-g3', label: 'Google Tensor G3' },
      { value: 'dimensity-7200', label: 'Dimensity 7200' },
      { value: 'helio-g99', label: 'Helio G99' },
      { value: 'helio-g85', label: 'Helio G85' },
    ]
  },
  {
    id: 'ram',
    label: 'RAM',
    icon: <HardDrive className="h-4 w-4" />,
    options: [
      { value: '6gb', label: '6 GB' },
      { value: '8gb', label: '8 GB' },
      { value: '12gb', label: '12 GB' },
      { value: '16gb', label: '16 GB' },
    ]
  },
  {
    id: 'battery',
    label: 'Batarya',
    icon: <Battery className="h-4 w-4" />,
    options: [
      { value: '4000-5000', label: '4000-5000 mAh' },
      { value: '5000+', label: '5000+ mAh' },
    ]
  },
];

interface QuickFiltersProps {
  selectedFilters: { [key: string]: string[] };
  onFilterChange: (filterId: string, value: string) => void;
  onResetFilters: () => void;
}

export function QuickFilters({ selectedFilters, onFilterChange, onResetFilters }: QuickFiltersProps) {
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({});
  const filterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const timeoutRef = useRef<NodeJS.Timeout>();

  const hasActiveFilters = Object.values(selectedFilters).some(filters => filters.length > 0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expandedFilter && !filterRefs.current[expandedFilter]?.contains(event.target as Node)) {
        setExpandedFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [expandedFilter]);

  const handleFilterMouseEnter = (filterId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setExpandedFilter(filterId);
    setSearchQueries(prev => ({ ...prev, [filterId]: '' }));
  };

  const handleFilterMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setExpandedFilter(null);
    }, 300);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setExpandedFilter(null);
    }, 300);
  };

  const handleSearchChange = (filterId: string, query: string) => {
    setSearchQueries(prev => ({ ...prev, [filterId]: query }));
  };

  const getFilteredOptions = (filter: QuickFilter) => {
    const searchQuery = searchQueries[filter.id]?.toLowerCase() || '';
    if (!searchQuery) return filter.options;

    return filter.options.filter(option =>
      option.label.toLowerCase().includes(searchQuery)
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg p-2">
      <div className="flex flex-wrap items-center gap-2">
        {quickFilters.map((filter) => (
          <div 
            key={filter.id} 
            ref={el => filterRefs.current[filter.id] = el}
            className="relative"
            onMouseEnter={() => handleFilterMouseEnter(filter.id)}
            onMouseLeave={handleFilterMouseLeave}
          >
            <button
              className={cn(
                "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap bg-white border shadow-sm",
                "hover:bg-gray-50 transition-colors",
                expandedFilter === filter.id && "border-orange-500 bg-orange-50",
                Object.keys(selectedFilters).includes(filter.id) && 
                selectedFilters[filter.id].length > 0 && 
                "border-orange-200 bg-orange-50 text-orange-600"
              )}
            >
              {filter.icon}
              <span>{filter.label}</span>
              {selectedFilters[filter.id]?.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs">
                  {selectedFilters[filter.id].length}
                </span>
              )}
              {expandedFilter === filter.id ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </button>
            
            {expandedFilter === filter.id && (
              <div 
                className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[240px]"
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={handleDropdownMouseLeave}
              >
                <div className="p-2">
                  {filter.id !== 'price' && (
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQueries[filter.id] || ''}
                        onChange={(e) => handleSearchChange(filter.id, e.target.value)}
                        placeholder={`${filter.label} ara...`}
                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                  )}

                  <div className="space-y-0.5 max-h-60 overflow-y-auto">
                    {getFilteredOptions(filter).map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer",
                          selectedFilters[filter.id]?.includes(option.value) && 
                          "bg-orange-50 text-orange-600"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[filter.id]?.includes(option.value) || false}
                          onChange={() => onFilterChange(filter.id, option.value)}
                          className="rounded text-orange-500 focus:ring-orange-500"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                    {getFilteredOptions(filter).length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500 text-center">
                        Sonuç bulunamadı
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
            <span>Filtreleri Temizle</span>
          </button>
        )}
      </div>
    </div>
  );
}