import React from 'react';
import { Newspaper, Loader2 } from 'lucide-react';
import { useNews } from '../../hooks/useNews';

export function AndroidNews() {
  const { news, isLoading, error } = useNews();

  if (error) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <Newspaper className="h-6 w-6 text-orange-600" />
            <h2 className="text-2xl font-bold">Android Haberleri</h2>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-orange-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {news.map((item) => (
              <article
                key={item.id}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-3 hover:text-orange-600">
                  <a href={item.link} target="_blank" rel="noopener noreferrer">
                    {item.title}
                  </a>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.summary}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{item.date}</span>
                  <span>{item.source}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}