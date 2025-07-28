"use client";

import React from 'react';

export const ProgressBar = ({ current, total, phase }: { current: number, total: number, phase: string }) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-6">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-center mt-2 text-sm text-gray-600">
        {phase === 'swipe' ? `Card ${current} of ${total}` :
         phase === 'vote' ? 'Ranking your preferences...' : 'Complete!'}
      </div>
    </div>
  );
};
