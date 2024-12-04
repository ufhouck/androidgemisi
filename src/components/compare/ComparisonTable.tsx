import React from 'react';
import { Phone } from '../../types/phone';
import { cn } from '../../lib/utils';

interface ComparisonTableProps {
  phones: Phone[];
}

export function ComparisonTable({ phones }: ComparisonTableProps) {
  const specs = [
    { label: 'İşlemci', key: 'processor' },
    { label: 'RAM', key: 'ram' },
    { label: 'Depolama', key: 'storage' },
    { label: 'Kamera', key: 'camera' },
    { label: 'Batarya', key: 'battery' },
    { label: 'Ekran', key: 'screen' }
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="p-4 text-left bg-gray-50 border-b font-medium text-gray-600">Özellik</th>
            {phones.map(phone => (
              <th key={phone.id} className="p-4 text-left bg-gray-50 border-b font-medium text-gray-900">
                <div className="space-y-1">
                  <div>{phone.name}</div>
                  <div className="text-orange-600 font-bold">{phone.price.tr}</div>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, index) => (
            <tr key={spec.key} className={cn("hover:bg-gray-50", index % 2 === 0 && "bg-gray-50/50")}>
              <td className="p-4 font-medium text-gray-600">{spec.label}</td>
              {phones.map(phone => (
                <td key={phone.id} className="p-4 text-gray-900">
                  {phone.specs[spec.key as keyof typeof phone.specs]}
                </td>
              ))}
            </tr>
          ))}
          <tr className="bg-orange-50">
            <td className="p-4 font-medium text-gray-600">Türkiye Fiyatı</td>
            {phones.map(phone => (
              <td key={phone.id} className="p-4 font-bold text-orange-600">{phone.price.tr}</td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="p-4 font-medium text-gray-600">Avrupa Fiyatı</td>
            {phones.map(phone => (
              <td key={phone.id} className="p-4">{phone.price.eu}</td>
            ))}
          </tr>
          <tr className="hover:bg-gray-50">
            <td className="p-4 font-medium text-gray-600">ABD Fiyatı</td>
            {phones.map(phone => (
              <td key={phone.id} className="p-4">{phone.price.us}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}