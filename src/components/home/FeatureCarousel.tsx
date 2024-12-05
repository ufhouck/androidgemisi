import React, { useState, useEffect } from 'react';
import { Brain, MessageSquare, TrendingUp, ThumbsUp } from 'lucide-react';
import { cn } from '../../lib/utils';

const features = [
  {
    icon: Brain,
    title: 'Yapay Zeka Analizi',
    description: 'Binlerce kullanıcı yorumunu yapay zeka ile analiz ediyoruz'
  },
  {
    icon: MessageSquare,
    title: 'Gerçek Deneyimler',
    description: 'Kullanıcı deneyimlerinden öne çıkan özellikleri belirliyoruz'
  },
  {
    icon: TrendingUp,
    title: 'Fiyat Takibi',
    description: 'Fiyat değişimlerini anlık olarak takip ediyoruz'
  },
  {
    icon: ThumbsUp,
    title: 'Tarafsız Öneriler',
    description: 'Yapay zeka destekli tarafsız telefon önerileri sunuyoruz'
  }
];

export function FeatureCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-white rounded-xl border border-gray-100 p-4 h-[140px] overflow-hidden">
      <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
        {features.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all",
              index === currentIndex 
                ? "bg-orange-600 w-3" 
                : "bg-gray-200"
            )}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <div className="relative h-full">
        {features.map((feature, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 flex flex-col items-center text-center transition-all duration-300",
              index === currentIndex
                ? "opacity-100 translate-x-0"
                : index < currentIndex
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            )}
          >
            <div className="bg-orange-50 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
              <feature.icon className="h-5 w-5 text-orange-600" />
            </div>
            <h3 className="font-semibold text-sm mb-1">{feature.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}