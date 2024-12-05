import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { phones } from '../../data/phones';
import { PhoneCard } from '../compare/PhoneCard';
import { ComparisonDrawer } from '../compare/ComparisonDrawer';
import { ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function FeaturedPhones() {
  const [selectedPhones, setSelectedPhones] = useState<string[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

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
    <section className={cn(
      "bg-gray-50",
      isMobile ? "py-4" : "py-8"
    )}>
      <div className="container mx-auto px-4">
        <div className={cn(
          "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
          isMobile ? "mb-4" : "mb-6"
        )}>
          <h2 className={cn(
            "font-bold",
            isMobile ? "text-xl" : "text-2xl sm:text-3xl"
          )}>Öne Çıkan Telefonlar</h2>
          <Link
            to="/karsilastir"
            className={cn(
              "inline-flex items-center justify-center border-2 border-orange-600 text-orange-600 font-medium rounded-full hover:bg-orange-50 transition-colors",
              isMobile ? "px-4 py-1.5 text-xs" : "px-6 py-2 text-sm"
            )}
          >
            Tüm Telefonları Gör
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {phones.slice(0, 6).map((phone) => (
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

        <div className={cn(
          "text-center",
          isMobile ? "mt-6" : "mt-8"
        )}>
          <Link
            to="/karsilastir"
            className={cn(
              "inline-flex items-center justify-center bg-orange-600 text-white font-medium rounded-full hover:bg-orange-700 transition-colors group",
              isMobile ? "px-6 py-2 text-sm" : "px-8 py-3 text-base"
            )}
          >
            <span>Tüm Android Telefonları İncele</span>
            <ArrowRight className={cn(
              "transition-transform group-hover:translate-x-1",
              isMobile ? "ml-1.5 h-3.5 w-3.5" : "ml-2 h-4 w-4"
            )} />
          </Link>
        </div>
      </div>
      
      {selectedPhonesData.length > 0 && (
        <ComparisonDrawer
          selectedPhones={selectedPhonesData}
          onRemovePhone={(id) => handlePhoneSelect(id)}
          isOpen={isDrawerOpen}
          onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
          variant={isMobile ? 'compact' : 'default'}
        />
      )}
    </section>
  );
}