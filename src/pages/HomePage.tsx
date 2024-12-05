import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { FeaturedPhones } from '../components/home/FeaturedPhones';
import { Brain, MessageSquare, TrendingUp, ThumbsUp } from 'lucide-react';
import { FeatureCarousel } from '../components/home/FeatureCarousel';
import { cn } from '../lib/utils';

const searchExamples = [
  'Samsung Galaxy S24 Ultra',
  'Google Pixel 8 Pro',
  'OnePlus 12',
  'Xiaomi 14 Pro'
];

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

export function HomePage() {
  const [searchText, setSearchText] = useState('');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const currentExample = searchExamples[currentExampleIndex];

    if (isTyping) {
      if (searchText.length < currentExample.length) {
        timeout = setTimeout(() => {
          setSearchText(currentExample.slice(0, searchText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (searchText.length > 0) {
        timeout = setTimeout(() => {
          setSearchText(searchText.slice(0, -1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          setCurrentExampleIndex((prev) => (prev + 1) % searchExamples.length);
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [searchText, currentExampleIndex, isTyping]);

  return (
    <main>
      <section className={cn(
        "bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-3",
        isMobile ? "py-8" : "py-16 min-h-[60vh]"
      )}>
        <div className="container max-w-6xl">
          <h1 className={cn(
            "font-bold text-gray-900 mb-4 text-center max-w-3xl mx-auto leading-tight",
            isMobile ? "text-2xl" : "text-3xl md:text-5xl mb-6"
          )}>
            En İyi Android Telefonları Karşılaştırın
          </h1>
          <p className={cn(
            "text-gray-600 mb-8 max-w-2xl mx-auto text-center",
            isMobile ? "text-base" : "text-lg md:text-xl mb-10"
          )}>
            Yapay zeka destekli kullanıcı yorumları ve güncel fiyatlarla akıllı telefon karşılaştırma platformu
          </p>
          
          <div className={cn(
            "mx-auto",
            isMobile ? "mb-8" : "max-w-2xl mb-16"
          )}>
            <SearchBar 
              placeholder={searchText}
              placeholderClassName="animate-pulse"
              variant={isMobile ? 'compact' : 'default'}
            />
          </div>
          
          {isMobile ? (
            <FeatureCarousel />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FeaturedPhones />
    </main>
  );
}