import React from 'react';
import type { Card as CardType } from '@/types/card';
import { Card } from '../Card';

interface VoteProps {
  leftCard: CardType;
  rightCard: CardType;
  onVoteComplete: (winnerId: string, loserId: string) => void;
}

export const Vote: React.FC<VoteProps> = ({ leftCard, rightCard, onVoteComplete }) => {
const [isLandscape, setIsLandscape] = React.useState(window.innerWidth > window.innerHeight);

  React.useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleVote = async (winnerId: string) => {
    const loserId = winnerId === leftCard._id ? rightCard._id : leftCard._id;
    onVoteComplete(winnerId, loserId);
  };

  return (
    <div 
      data-testid="voting-container"
className={`fixed inset-x-0 top-[calc(50%+40px)] -translate-y-1/2 mx-auto max-w-[80vw] flex gap-[5vw] justify-center items-center ${isLandscape ? 'flex-row' : 'flex-col'}`}
    >
      <div 
        className="w-full flex justify-center items-center"
        data-testid="card-container"
      >
        <Card 
          card={leftCard} 
          className="shadow-xl scale-90"
          onClick={() => handleVote(leftCard._id)}
        />
      </div>
      <div 
        className="w-full flex justify-center items-center"
        data-testid="card-container"
      >
        <Card 
          card={rightCard} 
          className="shadow-xl scale-90"
          onClick={() => handleVote(rightCard._id)}
        />
      </div>
    </div>
  );
};
