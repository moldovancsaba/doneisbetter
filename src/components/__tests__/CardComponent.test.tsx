import { render, screen } from '@testing-library/react';
import CardComponent from '../CardComponent';
import { Card } from '@/types/card';

describe('CardComponent', () => {
  const mockCard: Card = {
    _id: '1',
    title: 'Test Card',
    description: 'Test Description',
    imageUrl: 'test.jpg',
    rank: 1400
  };

  it('prevents image dragging', () => {
    render(<CardComponent card={mockCard} />);
    const image = screen.getByRole('img');
    
    expect(image).toHaveAttribute('draggable', 'false');
    expect(image).toHaveStyle('user-select: none');
    expect(image).toHaveStyle('-webkit-user-drag: none');
  });

  it('maintains aspect ratio', () => {
    render(<CardComponent card={mockCard} />);
    const image = screen.getByRole('img');
    
    expect(image).toHaveStyle('object-fit: cover');
    expect(image.parentElement).toHaveStyle('height: 100%');
  });
});
