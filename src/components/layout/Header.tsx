import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Smartphone, Menu, X, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { SearchDialog } from '../ui/SearchDialog';

export function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/', label: 'Ana Sayfa' },
    { path: '/karsilastir', label: 'Karşılaştır' },
    { path: '/yorumlar', label: 'Kullanıcı Yorumları' }
  ];

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full transition-all duration-200",
      isScrolled ? "bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b shadow-sm" : "bg-white"
    )}>
      <div className="container mx-auto">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="flex items-center space-x-2 shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <div className="relative">
                <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  AndroidGemisi
                </span>
                <span className="absolute -top-1 -right-6 text-[10px] font-medium text-orange-600 bg-orange-100 px-1 rounded">
                  beta
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map(item => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors relative group",
                    isActive(item.path) 
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-600 hover:text-orange-600 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-orange-600" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors",
                "border border-gray-200/50"
              )}
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Telefon ara...</span>
              <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
            
            <button
              onClick={() => setIsSearchOpen(true)}
              className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-2 border-t">
            <div className="space-y-1 p-1">
              {menuItems.map(item => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors",
                    isActive(item.path)
                      ? "bg-orange-50 text-orange-600"
                      : "hover:bg-gray-50"
                  )}
                >
                  <span>{item.label}</span>
                  {isActive(item.path) && (
                    <span className="ml-auto flex h-2 w-2 rounded-full bg-orange-600" />
                  )}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>

      <SearchDialog 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </header>
  );
}