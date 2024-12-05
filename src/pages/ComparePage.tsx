import React, { useState, useMemo } from 'react';
import { phones } from '../data/phones';
import { QuickFilters } from '../components/compare/QuickFilters';
import { FilterChips } from '../components/compare/FilterChips';
import { PhoneCard } from '../components/compare/PhoneCard';
import { ComparisonDrawer } from '../components/compare/ComparisonDrawer';

export function ComparePage() {
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [quickFilters, setQuickFilters] = useState<{ [key: string]: string[] }>({
    price: [],
    brand: [],
    processor: [],
    ram: [],
    battery: []
  });

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
    battery: {
      '4000-5000': '4000-5000 mAh',
      '5000+': '5000+ mAh',
    },
  };

  const filteredPhones = useMemo(() => {
    return phones.filter(phone => {
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
  }, [quickFilters]);

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
      battery: []
    });
  };

  const selectedPhonesData = phones.filter(phone => selectedPhones.includes(phone.id));

  return (
    <main className="container mx-auto px-4 py-4">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Android Telefonlar</h1>
        <div className="space-y-3">
          <QuickFilters
            selectedFilters={quickFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
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
            className="mt-3 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition-colors"
          >
            Tüm Telefonları Göster
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPhones.map((phone) => (
            <PhoneCard
              key={phone.id}
              phone={phone}
              isSelected={selectedPhones.includes(phone.id)}
              onSelect={handlePhoneSelect}
              disabled={selectedPhones.length >= 3 && !selectedPhones.includes(phone.id)}
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
        />
      )}
    </main>
  );
}