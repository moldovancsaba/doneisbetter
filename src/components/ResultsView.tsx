"use client";

import React, { useState } from 'react';
import { Trophy, User, RotateCcw } from 'lucide-react';
import { ICard } from '@/interfaces/Card';

interface IRanking {
    cardId: string;
    totalScore: number;
    card: ICard;
}

export const ResultsView = ({ personalRanking, globalRanking, onRestart }: { personalRanking: ICard[], globalRanking: IRanking[], onRestart: () => void }) => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Your Results</h2>
        <p className="text-gray-600 mt-2">See how your preferences compare</p>
      </div>

      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 rounded-lg p-1 flex">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'personal'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Your Ranking
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`px-6 py-2 rounded-md transition-all ${
              activeTab === 'global'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Global Ranking
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === 'personal' ? (
          <div className="space-y-3">
            {personalRanking.map((card, index) => (
              <div key={card.uuid} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-4">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{card.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{card.content.text}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {globalRanking.map((item, index) => (
              <div key={item.cardId} className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 ${
                  index === 0 ? 'bg-yellow-500 text-white' :
                  index === 1 ? 'bg-gray-400 text-white' :
                  index === 2 ? 'bg-orange-600 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.card.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2">{item.card.content.text}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Score</div>
                  <div className="text-xl font-bold text-blue-600">{item.totalScore}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-5 h-5" />
          Start New Session
        </button>
      </div>
    </div>
  );
};
