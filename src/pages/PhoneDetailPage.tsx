import React, { useState, useEffect, useRef } from 'react';
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
import { getReviewsByPhoneId } from '../data/reviews';
import { Review } from '../types/review';
import { slugifyPhoneName } from '../lib/utils/phoneUtils';

export function PhoneDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('specs');
  const [showTOC, setShowTOC] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const specsRef = useRef<HTMLDivElement>(null);
  const pricesRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  const phone = phones.find(p => slugifyPhoneName(p.name) === slug);

  useEffect(() => {
    async function loadReviews() {
      if (phone) {
        const phoneReviews = await getReviewsByPhoneId(phone.id);
        setReviews(phoneReviews);
      }
      setIsLoading(false);
    }

    loadReviews();
  }, [phone]);

  useEffect(() => {
    const handleScroll = () => {
      setShowTOC(window.scrollY > 100);

      const refs = {
        specs: specsRef.current?.offsetTop || 0,
        prices: pricesRef.current?.offsetTop || 0,
        reviews: reviewsRef.current?.offsetTop || 0
      };

      const scrollPosition = window.scrollY + 100;
      const positions = Object.entries(refs);

      for (let i = positions.length - 1; i >= 0; i--) {
        if (scrollPosition >= positions[i][1]) {
          setActiveSection(positions[i][0]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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
          {/* Specs Section */}
          <div ref={specsRef} className="bg-white rounded-lg shadow-md overflow-hidden">
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

          {/* Price Section */}
          <div ref={pricesRef}>
            <PriceComparison model={phone.name} />
          </div>

          {/* Reviews Section */}
          <div ref={reviewsRef} className="space-y-4">
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

      {/* Sticky TOC */}
      {showTOC && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
          <div className="container mx-auto px-4 py-2">
            <nav className="flex items-center justify-between gap-2">
              <button
                onClick={() => scrollToSection(specsRef)}
                className={cn(
                  "flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors text-center",
                  activeSection === 'specs'
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                Özellikler
              </button>
              <button
                onClick={() => scrollToSection(pricesRef)}
                className={cn(
                  "flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors text-center",
                  activeSection === 'prices'
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                Fiyatlar
              </button>
              <button
                onClick={() => scrollToSection(reviewsRef)}
                className={cn(
                  "flex-1 px-3 py-1.5 text-sm rounded-lg transition-colors text-center",
                  activeSection === 'reviews'
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                Yorumlar
              </button>
            </nav>
          </div>
        </div>
      )}
    </main>
  );
}