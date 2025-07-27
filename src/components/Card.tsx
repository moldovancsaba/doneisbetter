import React from 'react';
import { ICard } from '@/interfaces/Card';

const Card: React.FC<ICard> = ({ type, content }) => {
  return (
    <div>
      <h3>{type}</h3>
      <p>{content}</p>
    </div>
  );
};

export default Card;
