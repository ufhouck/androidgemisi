import React from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { FeaturedPhones } from '../components/home/FeaturedPhones';
import { Smartphone, Zap, Battery, Camera } from 'lucide-react';

export function HomePage() {
  return (
    <main>
      <section className="min-h-[70vh] bg-gradient-to-b from-orange-600 to-orange-800 flex items-center justify-center px-4 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Android Telefonları Karşılaştırın
          </h1>
          <p className="text-xl md:text-2xl text-orange-100 mb-12 max-w-3xl mx-auto">
            En güncel fiyatlar ve kullanıcı yorumlarıyla akıllı telefon karşılaştırma platformu
          </p>
          <div className="max-w-3xl mx-auto">
            <SearchBar 
              className="shadow-2xl"
              placeholder="Samsung S24, Google Pixel veya istediğiniz Android telefonu arayın..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Detaylı Karşılaştırma</h3>
              <p className="text-orange-100 text-sm">Telefonları özellik özellik karşılaştırın</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Performans Analizi</h3>
              <p className="text-orange-100 text-sm">Gerçek kullanıcı deneyimlerini inceleyin</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Battery className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Batarya Ömrü</h3>
              <p className="text-orange-100 text-sm">Batarya performanslarını karşılaştırın</p>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
              <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Camera className="h-6 w-6" />
              </div>
              <h3 className="font-semibold mb-2">Kamera Kalitesi</h3>
              <p className="text-orange-100 text-sm">Kamera özelliklerini değerlendirin</p>
            </div>
          </div>
        </div>
      </section>

      <FeaturedPhones />
    </main>
  );
}