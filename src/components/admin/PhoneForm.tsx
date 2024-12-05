import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { scrapePhoneData } from '../../services/phoneScraping';
import { useNavigate } from 'react-router-dom';

interface FormData {
  model: string;
  source: 'manual' | 'auto';
}

export function PhoneForm() {
  const [formData, setFormData] = useState<FormData>({
    model: '',
    source: 'auto'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const phone = await scrapePhoneData(formData.model);
      setMessage({ 
        type: 'success', 
        text: 'Telefon başarıyla eklendi! Karşılaştırma sayfasında görüntüleyebilirsiniz.' 
      });
      setFormData(prev => ({ ...prev, model: '' }));
      
      // Redirect to compare page after 2 seconds
      setTimeout(() => {
        navigate('/karsilastir');
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Telefon eklenirken bir hata oluştu. Lütfen tekrar deneyin.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold mb-6">Yeni Telefon Ekle</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
            Telefon Modeli
          </label>
          <input
            type="text"
            id="model"
            value={formData.model}
            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Örn: Samsung Galaxy S24 Ultra"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Veri Kaynağı
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="auto"
                checked={formData.source === 'auto'}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value as 'auto' | 'manual' }))}
                className="text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600">Otomatik (Web Scraping)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="manual"
                checked={formData.source === 'manual'}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value as 'auto' | 'manual' }))}
                className="text-orange-600 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600">Manuel Giriş</span>
            </label>
          </div>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !formData.model.trim()}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Ekleniyor...
            </>
          ) : (
            'Telefon Ekle'
          )}
        </button>
      </form>
    </div>
  );
}