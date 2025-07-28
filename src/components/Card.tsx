import React from 'react';
import { ICard } from '@/interfaces/Card';
import Image from 'next/image';

export const Card: React.FC<{ card: ICard }> = ({ card }) => {
  return (
    <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      {card.title && <h3 className="text-lg font-bold">{card.title}</h3>}
      {card.type === 'text' && <p className="text-gray-700">{card.content.text}</p>}
      {card.type === 'media' && card.content.mediaUrl && (
        <Image src={card.content.mediaUrl} alt={card.title || ''} width={256} height={256} className="object-cover w-full h-64" />
      )}
    </div>
  );
};
