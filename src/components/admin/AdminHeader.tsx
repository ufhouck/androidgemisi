import React from 'react';
import { Smartphone } from 'lucide-react';

export function AdminHeader() {
  return (
    <header className="bg-white border-b">
      <div className="px-4 py-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Android Gemisi Admin</h1>
            <p className="text-sm text-gray-500">Telefon ve İçerik Yönetimi</p>
          </div>
        </div>
      </div>
    </header>
  );
}