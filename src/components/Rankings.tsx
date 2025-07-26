"use client";

import React from 'react';
import Card from '@/components/Card';
import CardContainer from '@/components/CardContainer';
import { ICard } from '@/interfaces/Card';

interface RankingsProps {
  rankedCards: ICard[];
}

const Rankings: React.FC<RankingsProps> = ({ rankedCards }) => {
  return (
    <div>
      {rankedCards.length > 0 ? (
        <CardContainer cardCount={rankedCards.length}>
          {rankedCards.map((card) => (
            <Card
              key={card._id}
              type={card.type}
              content={card.content}
              metadata={card.metadata}
            />
          ))}
        </CardContainer>
      ) : (
        <p>You have no ranked cards yet.</p>
      )}
    </div>
  );
};

export default Rankings;
