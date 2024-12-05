import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { phones } from '../data/phones';
import { QuickFilters } from '../components/compare/QuickFilters';
import { FilterChips } from '../components/compare/FilterChips';
import { PhoneCard } from '../components/compare/PhoneCard';
import { ComparisonDrawer } from '../components/compare/ComparisonDrawer';
import { cn } from '../lib/utils';

export function ComparePage() {
  const [searchParams] = useSearchParams();
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [sorting, setSorting] = useState('price-asc');
  const [quickFilters, setQuickFilters] = useState<{ [key: string]: string[] }>({
    price: [],
    brand: [],
    processor: [],
    ram: [],
    battery: [],
    storage: []
  });

  // Initialize filters from URL parameters
  useEffect(() => {
    const newFilters = { ...quickFilters };
    
    for (const [key, value] of searchParams.entries()) {
      if (key in newFilters) {
        newFilters[key] = [value];
      }
    }
    
    setQuickFilters(newFilters);
  }, [searchParams]);

  const filterLabels = {
    price: {
      '0-10000': '10.000 ₺ altı',
      '10000-20000': '10.000 ₺ - 20.000 ₺',
      '20000-30000': '20.000 ₺ - 30.000 ₺',
      '30000-50000': '30.000 ₺ - 50.000 ₺',
      '50000-plus': '50.000 ₺ üzeri',
    },
    brand: {
      samsung: 'Samsung',
      xiaomi: 'Xiaomi',
      google: 'Google',
      oneplus: 'OnePlus',
      honor: 'Honor',
      tecno: 'Tecno',
      reeder: 'Reeder',
    },
    processor: {
      'snapdragon-8-gen-3': 'Snapdragon 8 Gen 3',
      'dimensity-9300': 'Dimensity 9300',
      'tensor-g3': 'Google Tensor G3',
      'dimensity-7200': 'Dimensity 7200',
      'helio-g99': 'Helio G99',
      'helio-g85': 'Helio G85',
    },
    ram: {
      '6gb': '6 GB',
      '8gb': '8 GB',
      '12gb': '12 GB',
      '16gb': '16 GB',
    },
    storage: {
      '128gb': '128 GB',
      '256gb': '256 GB',
      '512gb': '512 GB',
      '1tb': '1 TB',
    },
    battery: {
      '4000-5000': '4000-5000 mAh',
      '5000+': '5000+ mAh',
    },
  };

  const filteredPhones = useMemo(() => {
    let result = phones.filter(phone => {
      // Price filter
      if (quickFilters.price.length > 0) {
        const phonePrice = parseInt(phone.price.tr.replace(/[^0-9]/g, ''));
        const matchesPrice = quickFilters.price.some(range => {
          const [min, max] = range.split('-').map(Number);
          if (range === '50000-plus') {
            return phonePrice >= 50000;
          }
          return phonePrice >= min && phonePrice < max;
        });
        if (!matchesPrice) return false;
      }

      // Brand filter
      if (quickFilters.brand.length > 0) {
        const phoneBrand = phone.name.split(' ')[0].toLowerCase();
        if (!quickFilters.brand.some(brand => phoneBrand.includes(brand))) {
          return false;
        }
      }

      // Storage filter
      if (quickFilters.storage.length > 0) {
        const phoneStorage = phone.specs.storage.toLowerCase();
        if (!quickFilters.storage.some(storage => phoneStorage.includes(storage.replace('gb', '')))) {
          return false;
        }
      }

      // Processor filter
      if (quickFilters.processor.length > 0) {
        const phoneProcessor = phone.specs.processor.toLowerCase();
        if (!quickFilters.processor.some(proc => 
          phoneProcessor.includes(proc.replace(/-/g, ' '))
        )) {
          return false;
        }
      }

      // RAM filter
      if (quickFilters.ram.length > 0) {
        const phoneRam = parseInt(phone.specs.ram);
        if (!quickFilters.ram.some(ram => 
          phoneRam === parseInt(ram.replace('gb', ''))
        )) {
          return false;
        }
      }

      // Battery filter
      if (quickFilters.battery.length > 0) {
        const phoneBattery = parseInt(phone.specs.battery.replace(/[^0-9]/g, ''));
        const matchesBattery = quickFilters.battery.some(battery => {
          if (battery === '4000-5000') {
            return phoneBattery >= 4000 && phoneBattery <= 5000;
          }
          if (battery === '5000+') {
            return phoneBattery > 5000;
          }
          return false;
        });
        if (!matchesBattery) {
          return false;
        }
      }

      return true;
    });

    // Apply sorting
    if (sorting) {
      result = [...result].sort((a, b) => {
        switch (sorting) {
          case 'price-asc':
            return parseInt(a.price.tr.replace(/[^0-9]/g, '')) - parseInt(b.price.tr.replace(/[^0-9]/g, ''));
          case 'price-desc':
            return parseInt(b.price.tr.replace(/[^0-9]/g, '')) - parseInt(a.price.tr.replace(/[^0-9]/g, ''));
          case 'rating-desc':
            return b.rating - a.rating;
          case 'rating-asc':
            return a.rating - b.rating;
          default:
            return 0;
        }
      });
    }

    return result;
  }, [quickFilters, sorting]);

  const handlePhoneSelect = (phoneId: string) => {
    if (selectedPhones.includes(phoneId)) {
      setSelectedPhones(selectedPhones.filter(id => id !== phoneId));
    } else if (selectedPhones.length < 3) {
      setSelectedPhones([...selectedPhones, phoneId]);
      if (selectedPhones.length === 0) {
        setIsDrawerOpen(true);
      }
    }
  };

  const handleFilterChange = (filterId: string, value: string) => {
    setQuickFilters(prev => {
      const currentValues = prev[filterId] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [filterId]: newValues };
    });
  };

  const handleRemoveFilter = (filterId: string, value: string) => {
    setQuickFilters(prev => ({
      ...prev,
      [filterId]: prev[filterId].filter(v => v !== value)
    }));
  };

  const handleResetFilters = () => {
    setQuickFilters({
      price: [],
      brand: [],
      processor: [],
      ram: [],
      battery: [],
      storage: []
    });
    setSorting('price-asc');
  };

  const selectedPhonesData = phones.filter(phone => selectedPhones.includes(phone.id));
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <main className="container mx-auto px-4 py-4">
      <div className="mb-4">
        <h1 className={cn(
          "font-bold mb-4",
          isMobile ? "text-xl" : "text-2xl sm:text-3xl"
        )}>Android Telefonlar</h1>
        <div className="space-y-3">
          <QuickFilters
            selectedFilters={quickFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            sorting={sorting}
            onSortingChange={setSorting}
          />
          <FilterChips
            selectedFilters={quickFilters}
            filterLabels={filterLabels}
            onRemoveFilter={handleRemoveFilter}
          />
        </div>
      </div>

      {filteredPhones.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-3">Seçili filtrelerle eşleşen telefon bulunamadı.</p>
          <p className="text-gray-600">Farklı filtreler deneyebilir veya tüm telefonları görebilirsiniz.</p>
          <button
            onClick={handleResetFilters}
            className={cn(
              "mt-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors",
              isMobile ? "px-4 py-1.5 text-sm" : "px-6 py-2"
            )}
          >
            Tüm Telefonları Göster
          </button>
        </div>
      ) : (
        <div className={cn(
          "grid gap-4",
          isMobile ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        )}>
          {filteredPhones.map((phone) => (
            <PhoneCard
              key={phone.id}
              phone={phone}
              isSelected={selectedPhones.includes(phone.id)}
              onSelect={handlePhoneSelect}
              disabled={selectedPhones.length >= 3 && !selectedPhones.includes(phone.id)}
              variant={isMobile ? 'compact' : 'default'}
            />
          ))}
        </div>
      )}

      {selectedPhonesData.length > 0 && (
        <ComparisonDrawer
          selectedPhones={selectedPhonesData}
          onRemovePhone={(id) => handlePhoneSelect(id)}
          isOpen={isDrawerOpen}
          onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
          variant={isMobile ? 'compact' : 'default'}
        />
      )}
    </main>
  );
}