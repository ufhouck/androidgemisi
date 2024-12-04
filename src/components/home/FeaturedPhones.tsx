import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { phones } from '../../data/phones';
import { PhoneCard } from '../compare/PhoneCard';
import { ComparisonDrawer } from '../compare/ComparisonDrawer';

export function FeaturedPhones() {
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

  const selectedPhonesData = phones.filter(phone => selectedPhones.includes(phone.id));

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Öne Çıkan Telefonlar</h2>
          <Link
            to="/karsilastir"
            className="inline-flex items-center justify-center px-6 py-2 border-2 border-orange-600 text-orange-600 font-medium rounded-full hover:bg-orange-50 transition-colors text-sm"
          >
            Tüm Telefonları Gör
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {phones.slice(0, 6).map((phone) => (
            <PhoneCard
              key={phone.id}
              phone={phone}
              isSelected={selectedPhones.includes(phone.id)}
              onSelect={handlePhoneSelect}
              disabled={selectedPhones.length >= 3 && !selectedPhones.includes(phone.id)}
            />
          ))}
        </div>
      </div>
      {selectedPhonesData.length > 0 && (
        <ComparisonDrawer
          selectedPhones={selectedPhonesData}
          onRemovePhone={(id) => handlePhoneSelect(id)}
          isOpen={isDrawerOpen}
          onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        />
      )}
    </section>
  );
}