import React, { useState } from 'react';
import { phones } from '../data/phones';
import { PhoneCard } from '../components/compare/PhoneCard';
import { ComparisonTable } from '../components/compare/ComparisonTable';
import { ComparisonDrawer } from '../components/compare/ComparisonDrawer';
import { Trash2 } from 'lucide-react';

export function ComparePage() {
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const clearSelections = () => {
    setSelectedPhones([]);
    setIsDrawerOpen(false);
  };

  const selectedPhonesData = phones.filter(phone => selectedPhones.includes(phone.id));

  return (
    <main className="container mx-auto px-4 py-8 mb-32">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Telefon Karşılaştırma</h1>
        {selectedPhones.length > 0 && (
          <button
            onClick={clearSelections}
            className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Seçimleri Temizle</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {phones.map(phone => (
          <PhoneCard
            key={phone.id}
            phone={phone}
            isSelected={selectedPhones.includes(phone.id)}
            onSelect={handlePhoneSelect}
            disabled={selectedPhones.length >= 3 && !selectedPhones.includes(phone.id)}
          />
        ))}
      </div>
      
      {isDrawerOpen && selectedPhonesData.length > 0 && (
        <ComparisonTable phones={selectedPhonesData} />
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