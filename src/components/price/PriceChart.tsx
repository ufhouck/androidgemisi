import React from 'react';
import { phones } from '../../data/phones';

export function PriceChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Fiyat Karşılaştırma Grafiği</h2>
      <div className="space-y-6">
        {phones.map((phone) => (
          <div key={phone.id} className="space-y-2">
            <h3 className="font-medium">{phone.name}</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Türkiye</span>
                  <span className="font-semibold">{phone.price.tr}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Avrupa</span>
                  <span className="font-semibold">{phone.price.eu}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>ABD</span>
                  <span className="font-semibold">{phone.price.us}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}