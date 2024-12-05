import React from 'react';
import { Phone, MessageSquare, TrendingUp } from 'lucide-react';
import { phones } from '../../data/phones';
import { reviews } from '../../data/reviews';

export function AdminDashboard() {
  const stats = [
    {
      label: 'Toplam Telefon',
      value: phones.length,
      icon: Phone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Toplam Yorum',
      value: reviews.length,
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Aktif Fiyat Takibi',
      value: phones.length * 3, // TR, EU, US markets
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Genel Bakış</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-xl border">
            <div className="flex items-center space-x-4">
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}