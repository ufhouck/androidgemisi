import React, { useState, useRef, useEffect } from 'react';
import { Filter as FilterIcon, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { FilterModal } from './FilterModal';
import { getFilterConfig } from '../../config/filterConfig';

interface QuickFiltersProps {
  selectedFilters: { [key: string]: string[] };
  onFilterChange: (filterId: string, value: string) => void;
  onResetFilters: () => void;
  sorting: string;
  onSortingChange: (value: string) => void;
}

export function QuickFilters({ 
  selectedFilters, 
  onFilterChange, 
  onResetFilters,
  sorting,
  onSortingChange
}: QuickFiltersProps) {
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeModalFilter, setActiveModalFilter] = useState<string | null>(null);
  const filterRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(true);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const { mainFilters, additionalFilters } = getFilterConfig(isMobile);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        setShowLeftGradient(scrollLeft > 0);
        setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (!dropdownRef.current?.contains(target) && 
          !Object.values(filterRefs.current).some(ref => ref?.contains(target))) {
        setExpandedFilter(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFilterClick = (filterId: string, event: React.MouseEvent) => {
    event.stopPropagation();

    if (isMobile) {
      setActiveModalFilter(filterId);
      setShowFilterModal(true);
    } else {
      setExpandedFilter(expandedFilter === filterId ? null : filterId);
      setSearchQueries(prev => ({ ...prev, [filterId]: '' }));
    }
  };

  const handleCheckboxChange = (filterId: string, value: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onFilterChange(filterId, value);
  };

  const renderFilterContent = (filter: any) => {
    const searchQuery = searchQueries[filter.id]?.toLowerCase() || '';
    const filteredOptions = filter.options.filter((option: any) =>
      option.label.toLowerCase().includes(searchQuery)
    );

    return (
      <div className="space-y-0.5">
        {!isMobile && (
          <div className="relative mb-2" onClick={e => e.stopPropagation()}>
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQueries[filter.id] || ''}
              onChange={(e) => setSearchQueries(prev => ({ ...prev, [filter.id]: e.target.value }))}
              placeholder={`${filter.label} ara...`}
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        )}

        <div className={cn(
          "space-y-0.5",
          isMobile ? "px-2" : "max-h-60 overflow-y-auto"
        )}>
          {filteredOptions.map((option: any) => (
            <label
              key={option.value}
              className={cn(
                "flex items-center space-x-2 rounded-md cursor-pointer",
                isMobile ? "py-3 border-b border-gray-100" : "px-3 py-2 hover:bg-gray-50",
                selectedFilters[filter.id]?.includes(option.value) && "bg-orange-50 text-orange-600"
              )}
              onClick={e => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={selectedFilters[filter.id]?.includes(option.value) || false}
                onChange={(e) => handleCheckboxChange(filter.id, option.value, e as any)}
                className="rounded text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    );
  };

  const hasAdditionalFilters = Object.entries(selectedFilters)
    .filter(([key]) => additionalFilters.some(f => f.id === key))
    .some(([_, values]) => values.length > 0);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 relative">
      {/* Scroll Gradients */}
      {isMobile && (
        <>
          {showLeftGradient && (
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none z-10" />
          )}
          {showRightGradient && (
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none z-10" />
          )}
        </>
      )}

      <div 
        ref={scrollContainerRef}
        className={cn(
          "flex items-center gap-2",
          isMobile ? "flex-nowrap overflow-x-auto no-scrollbar" : "flex-wrap"
        )}
      >
        {/* Sorting Filter */}
        <div className="flex-none">
          <select
            value={sorting}
            onChange={(e) => onSortingChange(e.target.value)}
            className={cn(
              "bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500",
              isMobile ? "text-xs h-[30px] pl-2 pr-6" : "text-sm py-1.5 pl-2 pr-8"
            )}
          >
            <option value="price-asc">En Düşük Fiyat</option>
            <option value="price-desc">En Yüksek Fiyat</option>
            <option value="rating-desc">En Yüksek Puan</option>
            <option value="rating-asc">En Düşük Puan</option>
          </select>
        </div>

        {/* Main Filters */}
        {mainFilters.map((filter) => (
          <div
            key={filter.id}
            ref={el => filterRefs.current[filter.id] = el}
            className="relative flex-none"
          >
            <button
              onClick={(e) => handleFilterClick(filter.id, e)}
              className={cn(
                "flex items-center space-x-1.5 border rounded-lg transition-colors whitespace-nowrap",
                isMobile ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
                expandedFilter === filter.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-200 hover:border-gray-300 bg-white",
                selectedFilters[filter.id]?.length > 0 && "border-orange-200 bg-orange-50 text-orange-600"
              )}
            >
              <filter.icon className={cn(
                isMobile ? "h-3 w-3" : "h-4 w-4"
              )} />
              <span>{filter.label}</span>
              {selectedFilters[filter.id]?.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs">
                  {selectedFilters[filter.id].length}
                </span>
              )}
              {expandedFilter === filter.id ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {!isMobile && expandedFilter === filter.id && (
              <div 
                ref={dropdownRef}
                className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[240px]"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-2">
                  {renderFilterContent(filter)}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Additional Filters Button */}
        <div className="relative flex-none">
          <button
            onClick={(e) => handleFilterClick('additional', e)}
            className={cn(
              "flex items-center space-x-1.5 border rounded-lg transition-colors whitespace-nowrap",
              isMobile ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm",
              expandedFilter === 'additional'
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-gray-300 bg-white",
              hasAdditionalFilters && "border-orange-200 bg-orange-50 text-orange-600"
            )}
          >
            <FilterIcon className={cn(
              isMobile ? "h-3 w-3" : "h-4 w-4"
            )} />
            <span>Diğer</span>
            {hasAdditionalFilters && (
              <span className="ml-1 px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs">
                {Object.entries(selectedFilters)
                  .filter(([key]) => additionalFilters.some(f => f.id === key))
                  .reduce((acc, [_, values]) => acc + values.length, 0)}
              </span>
            )}
            {expandedFilter === 'additional' ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {!isMobile && expandedFilter === 'additional' && (
            <div 
              ref={dropdownRef}
              className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[240px]"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-2 space-y-4">
                {additionalFilters.map((filter) => (
                  <div key={filter.id}>
                    <div className="flex items-center space-x-2 px-3 mb-2">
                      <filter.icon className="h-4 w-4" />
                      <span className="font-medium text-sm">{filter.label}</span>
                    </div>
                    {renderFilterContent(filter)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobile && showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          onClose={() => {
            setShowFilterModal(false);
            setActiveModalFilter(null);
          }}
          title={activeModalFilter === 'additional' 
            ? 'Diğer Filtreler'
            : mainFilters.find(f => f.id === activeModalFilter)?.label || ''
          }
        >
          {activeModalFilter === 'additional' ? (
            <div className="space-y-6">
              {additionalFilters.map((filter) => (
                <div key={filter.id}>
                  <div className="flex items-center space-x-2 mb-3">
                    <filter.icon className="h-4 w-4" />
                    <span className="font-medium">{filter.label}</span>
                  </div>
                  {renderFilterContent(filter)}
                </div>
              ))}
            </div>
          ) : (
            renderFilterContent(mainFilters.find(f => f.id === activeModalFilter))
          )}
        </FilterModal>
      )}
    </div>
  );
}