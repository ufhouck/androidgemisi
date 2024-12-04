import React from 'react';
import { phones } from '../../data/phones';

export function PriceTable() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Detaylı Fiyat Tablosu</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Model</th>
              <th className="text-right py-3">Türkiye</th>
              <th className="text-right py-3">Avrupa</th>
              <th className="text-right py-3">ABD</th>
            </tr>
          </thead>
          <tbody>
            {phones.map((phone) => (
              <tr key={phone.id} className="border-b">
                <td className="py-4">{phone.name}</td>
                <td className="text-right py-4 font-medium text-blue-600">{phone.price.tr}</td>
                <td className="text-right py-4">{phone.price.eu}</td>
                <td className="text-right py-4">{phone.price.us}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}