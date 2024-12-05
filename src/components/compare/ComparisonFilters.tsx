import React from 'react';
import { Filter, Smartphone, Cpu, HardDrive, Battery } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FilterOption {
  value: string;
  label: string;
}

interface ComparisonFiltersProps {
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  setSelectedBrands: (brands: string[]) => void;
  selectedProcessors: string[];
  setSelectedProcessors: (processors: string[]) => void;
  selectedRam: string[];
  setSelectedRam: (ram: string[]) => void;
  selectedStorage: string[];
  setSelectedStorage: (storage: string[]) => void;
  selectedBattery: string[];
  setSelectedBattery: (battery: string[]) => void;
  brands: string[];
  processors: string[];
  ramOptions: FilterOption[];
  storageOptions: FilterOption[];
  batteryOptions: FilterOption[];
}

export function ComparisonFilters({
  priceRange,
  setPriceRange,
  selectedBrands,
  setSelectedBrands,
  selectedProcessors,
  setSelectedProcessors,
  selectedRam,
  setSelectedRam,
  selectedStorage,
  setSelectedStorage,
  selectedBattery,
  setSelectedBattery,
  brands,
  processors,
  ramOptions,
  storageOptions,
  batteryOptions,
}: ComparisonFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-fit space-y-6">
      <div className="flex items-center space-x-2 pb-2 border-b">
        <Filter className="h-5 w-5 text-orange-600" />
        <h2 className="text-lg font-semibold">Filtrele</h2>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="flex items-center space-x-2 font-medium mb-3">
          <Smartphone className="h-4 w-4" />
          <span>Fiyat Aralığı</span>
        </h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100000"
            step="1000"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-orange-600"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{priceRange[0].toLocaleString('tr-TR')} ₺</span>
            <span>{priceRange[1].toLocaleString('tr-TR')} ₺</span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="flex items-center space-x-2 font-medium mb-3">
          <Smartphone className="h-4 w-4" />
          <span>Markalar</span>
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {brands.map(brand => (
            <label key={brand} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBrands([...selectedBrands, brand]);
                  } else {
                    setSelectedBrands(selectedBrands.filter(b => b !== brand));
                  }
                }}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Processors */}
      <div>
        <h3 className="flex items-center space-x-2 font-medium mb-3">
          <Cpu className="h-4 w-4" />
          <span>İşlemci</span>
        </h3>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {processors.map(processor => (
            <label key={processor} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedProcessors.includes(processor)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProcessors([...selectedProcessors, processor]);
                  } else {
                    setSelectedProcessors(selectedProcessors.filter(p => p !== processor));
                  }
                }}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm">{processor}</span>
            </label>
          ))}
        </div>
      </div>

      {/* RAM */}
      <div>
        <h3 className="flex items-center space-x-2 font-medium mb-3">
          <HardDrive className="h-4 w-4" />
          <span>RAM</span>
        </h3>
        <div className="space-y-2">
          {ramOptions.map(option => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRam.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRam([...selectedRam, option.value]);
                  } else {
                    setSelectedRam(selectedRam.filter(r => r !== option.value));
                  }
                }}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage */}
      <div>
        <h3 className="flex items-center space-x-2 font-medium mb-3">
          <HardDrive className="h-4 w-4" />
          <span>Depolama</span>
        </h3>
        <div className="space-y-2">
          {storageOptions.map(option => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedStorage.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedStorage([...selectedStorage, option.value]);
                  } else {
                    setSelectedStorage(selectedStorage.filter(s => s !== option.value));
                  }
                }}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Battery */}
      <div>
        <h3 className="flex items-center space-x-2 font-medium mb-3">
          <Battery className="h-4 w-4" />
          <span>Batarya</span>
        </h3>
        <div className="space-y-2">
          {batteryOptions.map(option => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedBattery.includes(option.value)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedBattery([...selectedBattery, option.value]);
                  } else {
                    setSelectedBattery(selectedBattery.filter(b => b !== option.value));
                  }
                }}
                className="rounded text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}