import React from 'react';

interface CardContainerProps {
  children: React.ReactNode;
  cardCount: number;
}

const CardContainer: React.FC<CardContainerProps> = ({ children, cardCount }) => {
  const getGridClass = () => {
    if (cardCount === 1) {
      return 'flex justify-center items-center h-screen';
    }
    if (cardCount === 2) {
      return 'flex flex-col md:flex-row justify-center items-center h-screen gap-4';
    }
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4';
  };

  return <div className={getGridClass()}>{children}</div>;
};

export default CardContainer;
