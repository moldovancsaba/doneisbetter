'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { Card } from '@/app/page';
import CardItem from './CardItem';

interface CardCanvasProps {
  cards: Card[];
  onCardsChange: (cards: Card[]) => void;
}

export default function CardCanvas({ cards, onCardsChange }: CardCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 0 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (!event.active || !event.delta) {
      setActiveId(null);
      return;
    }
    const { active, delta } = event;
    const updatedCards = cards.map((card) =>
      card.id === active.id
        ? {
            ...card,
            position: {
              x: card.position.x + delta.x,
              y: card.position.y + delta.y,
            },
          }
        : card
    );
    onCardsChange(updatedCards);
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="canvas-container"
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          background: '#f6f8fa',
        }}
      >
        {cards.map((card, idx) => (
          <CardItem key={card.id} card={card} index={idx} isOverlay={false} />
        ))}
      </div>
      <DragOverlay>
        {activeId ? (
          <CardItem
            key={'drag-'+activeId}
            card={cards.find(c => c.id === activeId)!}
            index={0}
            isOverlay={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

