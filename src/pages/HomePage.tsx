import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { FeaturedPhones } from '../components/home/FeaturedPhones';
import { Brain, MessageSquare, TrendingUp, ThumbsUp } from 'lucide-react';

const searchExamples = [
  'Samsung Galaxy S24 Ultra',
  'Google Pixel 8 Pro',
  'OnePlus 12',
  'Xiaomi 14 Pro'
];

export function HomePage() {
  const [searchText, setSearchText] = useState('');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

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
      <section className="min-h-[60vh] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-3 py-16">
        <div className="container max-w-6xl">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 text-center max-w-3xl mx-auto leading-tight">
            En İyi Android Telefonları Karşılaştırın
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto text-center">
            Yapay zeka destekli kullanıcı yorumları ve güncel fiyatlarla akıllı telefon karşılaştırma platformu
          </p>
          
          <div className="max-w-2xl mx-auto mb-16">
            <SearchBar 
              placeholder={searchText}
              placeholderClassName="animate-pulse"
            />
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Yapay Zeka Analizi</h3>
              <p className="text-gray-600 text-sm">Binlerce kullanıcı yorumunu yapay zeka ile analiz ediyoruz</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Gerçek Deneyimler</h3>
              <p className="text-gray-600 text-sm">Kullanıcı deneyimlerinden öne çıkan özellikleri belirliyoruz</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Fiyat Takibi</h3>
              <p className="text-gray-600 text-sm">Fiyat değişimlerini anlık olarak takip ediyoruz</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                <ThumbsUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2 text-gray-900">Tarafsız Öneriler</h3>
              <p className="text-gray-600 text-sm">Yapay zeka destekli tarafsız telefon önerileri sunuyoruz</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedPhones />
    </main>
  );
}