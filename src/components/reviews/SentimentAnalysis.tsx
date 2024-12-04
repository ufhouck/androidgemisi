import React from 'react';
import { Smile, Meh, Frown } from 'lucide-react';

interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
  total: number;
}

const sentimentData: SentimentData = {
  positive: 75,
  neutral: 15,
  negative: 10,
  total: 100
};

export function SentimentAnalysis() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6">Yorum Analizi</h2>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-green-600">
              <Smile className="h-5 w-5 mr-2" />
              <span>Olumlu</span>
            </div>
            <span className="font-medium">{sentimentData.positive}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${sentimentData.positive}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-yellow-600">
              <Meh className="h-5 w-5 mr-2" />
              <span>Nötr</span>
            </div>
            <span className="font-medium">{sentimentData.neutral}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-600 h-2 rounded-full"
              style={{ width: `${sentimentData.neutral}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-red-600">
              <Frown className="h-5 w-5 mr-2" />
              <span>Olumsuz</span>
            </div>
            <span className="font-medium">{sentimentData.negative}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-600 h-2 rounded-full"
              style={{ width: `${sentimentData.negative}%` }}
            ></div>
          </div>
        </div>
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            Toplam {sentimentData.total} yorum analiz edildi
          </p>
        </div>
      </div>
    </div>
  );
}