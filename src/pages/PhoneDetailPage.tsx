import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { phones } from '../data/phones';
import { 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Smartphone, 
  Cpu, 
  HardDrive, 
  Gauge, 
  Camera as CameraIcon,
  Monitor
} from 'lucide-react';
import { cn } from '../lib/utils';
import { ReviewsList } from '../components/reviews/ReviewsList';
import { ReviewSummary } from '../components/reviews/ReviewSummary';
import { PriceComparison } from '../components/price/PriceComparison';
import { getPhoneReviews } from '../services/reviewAnalysis';
import { Review } from '../types/review';

export function PhoneDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const phone = phones.find(p => slugify(p.name) === slug);

  useEffect(() => {
    async function loadReviews() {
      if (phone) {
        const phoneReviews = await getPhoneReviews(phone.name);
        setReviews(phoneReviews);
        setIsLoading(false);
      }
    }

    loadReviews();
  }, [phone]);

  if (!phone) {
    return (
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold">Telefon bulunamadı</h1>
      </div>
    );
  }

  const specs = [
    { icon: Cpu, label: 'İşlemci', value: phone.specs.processor },
    { icon: HardDrive, label: 'RAM', value: phone.specs.ram },
    { icon: HardDrive, label: 'Depolama', value: phone.specs.storage },
    { icon: CameraIcon, label: 'Kamera', value: phone.specs.camera },
    { icon: Gauge, label: 'Batarya', value: phone.specs.battery },
    { icon: Monitor, label: 'Ekran', value: phone.specs.screen }
  ];

  return (
    <main className="container mx-auto px-4 py-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex items-start gap-2 mb-4">
          <div className="bg-orange-100 rounded-lg p-2">
            <Smartphone className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className={cn(
              "font-bold text-gray-900",
              isMobile ? "text-xl" : "text-2xl sm:text-3xl"
            )}>{phone.name}</h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 font-medium">{phone.rating}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(phone.releaseDate).toLocaleDateString('tr-TR')}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4">
          {/* Price Section - Mobile Only */}
          {isMobile && (
            <div className="bg-white rounded-lg shadow-md">
              <PriceComparison model={phone.name} />
            </div>
          )}

          {/* Specs Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => setIsSpecsOpen(!isSpecsOpen)}
              className="w-full flex items-center justify-between p-3 font-medium text-left hover:bg-gray-50 transition-colors"
            >
              <span>Teknik Özellikler</span>
              {isSpecsOpen ? (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>
            
            {isSpecsOpen && (
              <div className={cn(
                "border-t divide-y",
                isMobile ? "text-sm" : "text-base"
              )}>
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center p-3 gap-3">
                    <Icon className={cn(
                      "text-gray-400 flex-shrink-0",
                      isMobile ? "h-4 w-4" : "h-5 w-5"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-500">{label}</div>
                      <div className="font-medium truncate">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price Section - Desktop Only */}
          {!isMobile && (
            <div className="bg-white rounded-lg shadow-md">
              <PriceComparison model={phone.name} />
            </div>
          )}

          {/* Reviews Section */}
          <div className="space-y-4">
            <h2 className={cn(
              "font-semibold",
              isMobile ? "text-lg" : "text-xl"
            )}>Kullanıcı Yorumları</h2>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">
                Yorumlar yükleniyor...
              </div>
            ) : (
              <>
                <ReviewSummary reviews={reviews} />
                <ReviewsList reviews={reviews} />
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}