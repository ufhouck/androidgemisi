import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

const routes: { [key: string]: { label: string; link?: string } } = {
  '/': { label: 'Ana Sayfa' },
  '/karsilastir': { label: 'Android Telefonlar' },
  '/yorumlar': { label: 'Kullanıcı Yorumları' },
  '/telefon': { label: 'Android Telefonlar', link: '/karsilastir' },
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  // Don't show breadcrumbs on homepage
  if (location.pathname === '/') return null;

  return (
    <nav className="container mx-auto py-3">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link
            to="/"
            className="flex items-center text-gray-500 hover:text-orange-600 transition-colors"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          // Handle dynamic routes and custom links
          let displayName = routes[routeTo]?.label || name;
          let linkTo = routes[routeTo]?.link || routeTo;

          if (name === 'telefon') {
            displayName = routes['/telefon'].label;
            linkTo = routes['/telefon'].link || routeTo;
          } else if (name.includes('-') && !routes[routeTo]) {
            displayName = name.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
          }

          return (
            <React.Fragment key={routeTo}>
              <li>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </li>
              <li>
                {isLast ? (
                  <span className="text-gray-900 font-medium">{displayName}</span>
                ) : (
                  <Link
                    to={linkTo}
                    className={cn(
                      "text-gray-500 hover:text-orange-600 transition-colors",
                      isLast && "text-gray-900 hover:text-gray-900"
                    )}
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}