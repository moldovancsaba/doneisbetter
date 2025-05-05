import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/app/types/card';

interface CardItemProps {
  card: Card;
  index: number;
  onDelete: (cardId: string) => Promise<void>;
  isDeletedView?: boolean;
}

export default function CardItem({ card, index, onDelete, isDeletedView = false }: CardItemProps) {
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this card?')) {
      await onDelete(card.id);
    }
  };

  return (
    <Draggable 
      draggableId={card.id} 
      index={index}
      isDragDisabled={isDeletedView}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-3 mb-2 bg-white rounded shadow ${snapshot.isDragging ? 'shadow-lg' : ''}`}
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-800">{card.content}</h3>
            
            {!isDeletedView && (
              <button 
                onClick={handleDelete}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              </button>
            )}
          </div>
          
          {card.description && (
            <p className="mt-2 text-sm text-gray-600">{card.description}</p>
          )}
          
          {/* Display additional card information if available */}
          <div className="mt-3 flex flex-wrap gap-2">
            {card.priority && (
              <span className={`text-xs px-2 py-1 rounded ${
                card.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                card.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {card.priority}
              </span>
            )}
            
            {card.dueDate && (
              <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800">
                Due: {new Date(card.dueDate).toLocaleDateString()}
              </span>
            )}
            
            {isDeletedView && card.deletedAt && (
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                Deleted: {new Date(card.deletedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

