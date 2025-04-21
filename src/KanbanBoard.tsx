'use client';

import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from '@/app/page';
import CardItem from '../CardItem';
import Column from './Column';

interface KanbanBoardProps {
  cards: Card[];
  onCardsChange: (cards: Card[]) => void;
}

export default function KanbanBoard({ cards, onCardsChange }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0, // Start dragging immediately to match cursor
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = cards.findIndex((card) => card.id === active.id);
      const newIndex = cards.findIndex((card) => card.id === over.id);
      
      const newCards = arrayMove(cards, oldIndex, newIndex);
      onCardsChange(newCards);
    }
    
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="kanban-grid">
        <div className="grid-row">
          <Column title="To Do" count={cards.length}>
            <SortableContext
              items={cards.map(card => card.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="card-list-in-column">
                {cards.map((card, index) => (
                  <CardItem
                    key={card.id}
                    card={card}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </Column>
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="card-item-draggable dragging">
            <div className="card">
              <p className="card-content">
                {cards.find(card => card.id === activeId)?.content}
              </p>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
