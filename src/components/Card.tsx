import React from 'react';
import { ICard } from '@/interfaces/Card';

export const Card: React.FC<{ card: ICard }> = ({ card }) => {
  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      {card.title && <h3 className="text-lg font-bold">{card.title}</h3>}
      {card.type === 'text' && <p className="text-gray-700">{card.content.text}</p>}
      {card.type === 'media' && card.content.mediaUrl && (
        <img src={card.content.mediaUrl} alt={card.title || ''} className="object-cover w-full h-64" />
      )}
    </div>
  );
};
