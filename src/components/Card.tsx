import React from 'react';
import Image from 'next/image';

interface CardProps {
  type: 'image' | 'text';
  content: string;
  metadata?: {
    aspectRatio?: number;
  };
}

const Card: React.FC<CardProps> = ({ type, content, metadata }) => {
  if (type === 'image') {
    const aspectRatio = metadata?.aspectRatio || 1;
    return (
      <div className="card object-contain" style={{ aspectRatio: `${aspectRatio}` }}>
        <Image src={content} alt="Card" layout="fill" objectFit="contain" />
      </div>
    );
  }

  return (
    <div className="card" style={{ aspectRatio: '3 / 4' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          padding: '5%',
          textAlign: 'center',
        }}
      >
        <span style={{ fontSize: '10vw' }}>{content}</span>
      </div>
    </div>
  );
};

export default Card;
