"use client";

import React from 'react';
import Link from 'next/link';

interface ICard {
  _id: string;
  md5: string;
  slug: string;
  type: 'image' | 'text';
  content: string;
}

interface CardListProps {
  cards: ICard[];
  onDelete: (md5: string) => void;
}

const CardList: React.FC<CardListProps> = ({ cards, onDelete }) => {
  return (
    <div>
      {cards.length > 0 ? (
        <ul>
          {cards.map((card) => (
            <li key={card._id} className="border p-4 my-2 flex justify-between items-center">
              <div>
                <p className="font-bold">{card.slug}</p>
                <p>{card.content}</p>
              </div>
              <div>
                <Link href={`/dashboard/cards/${card.md5}/edit`}>
                  <a className="text-blue-500 hover:underline mr-4">Edit</a>
                </Link>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => onDelete(card.md5)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cards found.</p>
      )}
    </div>
  );
};

export default CardList;
