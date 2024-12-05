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
    <div className="overflow-x-auto -mx-3 sm:-mx-4">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="py-2.5 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                Özellik
              </th>
              {phones.map(phone => (
                <th key={phone.id} scope="col" className="py-2.5 px-3 text-left bg-gray-50">
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium text-gray-900">{phone.name}</div>
                    <div className="text-sm text-orange-600 font-semibold">{phone.price.tr}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {specs.map((spec, index) => (
              <tr key={spec.key} className={index % 2 === 0 ? 'bg-gray-50' : undefined}>
                <td className="py-2.5 px-3 text-xs font-medium text-gray-500">{spec.label}</td>
                {phones.map(phone => (
                  <td key={phone.id} className="py-2.5 px-3 text-sm text-gray-900">
                    {phone.specs[spec.key as keyof typeof phone.specs]}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-orange-50">
              <td className="py-2.5 px-3 text-xs font-medium text-gray-500">Türkiye Fiyatı</td>
              {phones.map(phone => (
                <td key={phone.id} className="py-2.5 px-3 text-sm font-semibold text-orange-600">
                  {phone.price.tr}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-xs font-medium text-gray-500">Avrupa Fiyatı</td>
              {phones.map(phone => (
                <td key={phone.id} className="py-2.5 px-3 text-sm text-gray-900">
                  {phone.price.eu}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-2.5 px-3 text-xs font-medium text-gray-500">ABD Fiyatı</td>
              {phones.map(phone => (
                <td key={phone.id} className="py-2.5 px-3 text-sm text-gray-900">
                  {phone.price.us}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}