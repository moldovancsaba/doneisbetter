"use client";

import React, { useState } from 'react';
import { ICard } from '@/interfaces/Card';

export const VoteComparison = ({ cardA, cardB, onVote }: { cardA: ICard, cardB: ICard, onVote: (cardA: string, cardB: string, winner: string) => void }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleVote = (winner: string) => {
    if (isAnimating) return;

    setSelectedCard(winner);
    setIsAnimating(true);

    setTimeout(() => {
      onVote(cardA.uuid, cardB.uuid, winner);
      setIsAnimating(false);
      setSelectedCard(null);
    }, 300);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header section - Fixed height to prevent overlap */}
      <div className="flex-shrink-0 text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 select-none mb-2">Which do you prefer?</h2>
        <p className="text-gray-600 text-sm md:text-base select-none">Tap the card you like more</p>
      </div>

      {/* Cards container - Horizontal layout with proper spacing */}
      <div className="flex-1 flex gap-3 sm:gap-4 min-h-0 overflow-hidden">
        {[cardA, cardB].map((card) => (
          <div
            key={card.uuid}
            onClick={() => handleVote(card.uuid)}
            className={`flex-1 bg-white rounded-xl shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-100 select-none min-w-0 ${
              selectedCard === card.uuid ? 'scale-105 ring-4 ring-blue-500' : ''
            } ${
              selectedCard && selectedCard !== card.uuid ? 'opacity-50 scale-95' : ''
            }`}
            style={{
              aspectRatio: '3/4',
              userSelect: 'none',
              maxHeight: '100%'
            }}
          >
            <div className="h-full flex flex-col p-3 sm:p-4 min-h-0">
              {/* Card header - Fixed height */}
              <div className="flex-shrink-0 h-12 sm:h-16 flex items-center justify-center mb-2 sm:mb-3">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 text-center leading-tight line-clamp-2 select-none">
                  {card.title}
                </h3>
              </div>

              {/* Card content - Flexible but constrained */}
              <div className="flex-1 flex items-center justify-center min-h-0 mb-2 sm:mb-3">
                <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed text-center line-clamp-3 sm:line-clamp-4 select-none overflow-hidden">
                  {card.content.text}
                </p>
              </div>

              {/* Card tags - Fixed height */}
              <div className="flex-shrink-0 h-6 sm:h-8 flex items-center justify-center">
                {card.tags && card.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-1 overflow-hidden">
                    {card.tags.slice(0, 2).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200 select-none whitespace-nowrap"
                      >
                        {tag.length > 6 ? `${tag.substring(0, 6)}...` : tag}
                      </span>
                    ))}
                    {card.tags.length > 2 && (
                      <span className="px-1 py-0.5 text-gray-500 text-xs select-none">
                        +{card.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
