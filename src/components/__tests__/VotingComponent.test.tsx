import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import VotingComponent from '../VotingComponent';
import { Card } from '@/types/card';

const mockCards: Card[] = [
  {
    _id: '1',
    title: 'Card 1',
    description: 'Description 1',
    imageUrl: 'test1.jpg',
    rank: 1400
  },
  {
    _id: '2',
    title: 'Card 2',
    description: 'Description 2',
    imageUrl: 'test2.jpg',
    rank: 1400
  }
];

describe('VotingComponent', () => {
  beforeEach(() => {
    // Mock window.innerWidth and window.innerHeight
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768
    });
  });

  it('uses horizontal layout in landscape mode', () => {
    window.innerWidth = 1024;
    window.innerHeight = 768;
    
    render(<VotingComponent cards={mockCards} onVote={() => {}} />);
    const container = screen.getByTestId('voting-container');
    
    expect(container).toHaveClass('flex-row');
    expect(container).not.toHaveClass('flex-col');
  });

  it('uses vertical layout in portrait mode', () => {
    window.innerWidth = 768;
    window.innerHeight = 1024;
    
    render(<VotingComponent cards={mockCards} onVote={() => {}} />);
    const container = screen.getByTestId('voting-container');
    
    expect(container).toHaveClass('flex-col');
    expect(container).not.toHaveClass('flex-row');
  });

  it('uses vertical layout in square viewport', () => {
    window.innerWidth = 800;
    window.innerHeight = 800;
    
    render(<VotingComponent cards={mockCards} onVote={() => {}} />);
    const container = screen.getByTestId('voting-container');
    
    expect(container).toHaveClass('flex-col');
    expect(container).not.toHaveClass('flex-row');
  });

  it('maintains card aspect ratios', () => {
    render(<VotingComponent cards={mockCards} onVote={() => {}} />);
    const cardElements = screen.getAllByTestId('card-container');
    
    cardElements.forEach(card => {
      expect(card).toHaveStyle('height: 100%');
      const image = card.querySelector('img');
      expect(image).toHaveStyle('object-fit: cover');
    });
  });

  it('adjusts layout on window resize', () => {
    render(<VotingComponent cards={mockCards} onVote={() => {}} />);
    const container = screen.getByTestId('voting-container');
    
    // Start in landscape
    expect(container).toHaveClass('flex-row');
    
    // Switch to portrait
    act(() => {
      window.innerWidth = 768;
      window.innerHeight = 1024;
      window.dispatchEvent(new Event('resize'));
    });
    
    expect(container).toHaveClass('flex-col');
  });
});
