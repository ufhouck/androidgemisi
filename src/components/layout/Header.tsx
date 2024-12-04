import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Menu, X } from 'lucide-react';
import { SearchBar } from '../ui/SearchBar';
import { cn } from '../../lib/utils';

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Smartphone className="h-6 w-6 text-orange-600" />
            <span className="text-xl font-bold">AndroidGemisi</span>
          </Link>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-600",
                isActive('/') && "text-orange-600"
              )}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/karsilastir" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-600",
                isActive('/karsilastir') && "text-orange-600"
              )}
            >
              Karşılaştır
            </Link>
            <Link 
              to="/yorumlar" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-600",
                isActive('/yorumlar') && "text-orange-600"
              )}
            >
              Kullanıcı Yorumları
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className={cn(
          "md:hidden",
          isMenuOpen ? "block" : "hidden"
        )}>
          <nav className="py-4 space-y-2 border-t">
            <Link 
              to="/" 
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block px-4 py-2 rounded-lg transition-colors hover:bg-orange-50",
                isActive('/') && "bg-orange-50 text-orange-600"
              )}
            >
              Ana Sayfa
            </Link>
            <Link 
              to="/karsilastir"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block px-4 py-2 rounded-lg transition-colors hover:bg-orange-50",
                isActive('/karsilastir') && "bg-orange-50 text-orange-600"
              )}
            >
              Karşılaştır
            </Link>
            <Link 
              to="/yorumlar"
              onClick={() => setIsMenuOpen(false)}
              className={cn(
                "block px-4 py-2 rounded-lg transition-colors hover:bg-orange-50",
                isActive('/yorumlar') && "bg-orange-50 text-orange-600"
              )}
            >
              Kullanıcı Yorumları
            </Link>
          </nav>
        </div>

        <div className="py-4">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}