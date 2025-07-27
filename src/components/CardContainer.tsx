import React from 'react';

const CardContainer: React.FC<{ children: React.ReactNode, cardCount: number }> = ({ children }) => {
  return <div>{children}</div>;
};

export default CardContainer;
