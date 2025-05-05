'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardStatus } from '@/app/types/card';
import Column from './Column';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { toast } from 'react-hot-toast';
import { updateCardStatus, softDeleteCard } from '@/lib/actions';
import { ErrorBoundary } from '@/lib/errors/ErrorBoundary';
import { APIErrorType, APIError } from '@/lib/middleware/errorHandler';

interface KanbanBoardProps {
  initialCards: Card[];
  view: 'kanban' | 'eisenhower' | 'all' | 'deleted';
}

/**
 * Custom error fallback component for KanbanBoard errors
 */
const KanbanBoardErrorFallback = ({ error, reset }: { error: Error, reset: () => void }) => {
  // Extract error type if it's an APIError
  let errorType = 'unknown';
  let errorDetails: Record<string, any> = {};
  
  if (error && typeof error === 'object' && 'type' in error) {
    errorType = error.type as string;
    if ('details' in error) {
      errorDetails = (error.details as Record<string, any>) || {};
    }
  }

  // Log the error
  useEffect(() => {
    console.error('KanbanBoard error:', error);
    
    // You could also send to a monitoring service like Sentry here
    // Example: Sentry.captureException(error);
  }, [error]);

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3">
          <svg 
            className="h-6 w-6 text-red-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h2 className="mb-2 text-xl font-semibold text-red-800">
          {errorType === APIErrorType.DATABASE 
            ? 'Database Connection Error'
            : errorType === APIErrorType.VALIDATION
              ? 'Validation Error'
              : errorType === APIErrorType.NOT_FOUND
                ? 'Resource Not Found'
                : 'Something went wrong'}
        </h2>
        
        <p className="mb-4 text-sm text-red-600">
          {error.message || 'Unable to load your board at the moment.'}
        </p>

        {/* Show validation errors if available */}
        {errorType === APIErrorType.VALIDATION && errorDetails.errors && (
          <div className="mb-4 max-w-md text-left text-sm text-red-600">
            <ul className="list-inside list-disc">
              {Object.entries(errorDetails.errors).map(([field, errors]) => (
                <li key={field}>
                  <strong>{field}:</strong> {Array.isArray(errors) ? errors.join(', ') : errors}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="mt-2 flex gap-2">
          <button
            onClick={reset}
            className="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Try Again
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * KanbanBoard component with error handling
 */
const KanbanBoardWithErrorHandling = ({ initialCards, view }: KanbanBoardProps) => {
  // State for each column's cards
  const [todoCards, setTodoCards] = useState<Card[]>([]);
  const [inProgressCards, setInProgressCards] = useState<Card[]>([]);
  const [doneCards, setDoneCards] = useState<Card[]>([]);
  
  // State for Eisenhower Matrix quadrants
  const [q1Cards, setQ1Cards] = useState<Card[]>([]);  // Important & Urgent
  const [q2Cards, setQ2Cards] = useState<Card[]>([]);  // Important & Not Urgent
  const [q3Cards, setQ3Cards] = useState<Card[]>([]);  // Not Important & Urgent
  const [q4Cards, setQ4Cards] = useState<Card[]>([]);  // Not Important & Not Urgent
  
  // State for special views
  const [deletedCards, setDeletedCards] = useState<Card[]>([]);
  const [allCards, setAllCards] = useState<Card[]>([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize the cards
  useEffect(() => {
    if (initialCards) {
      try {
        // Filter cards into their respective columns
        const todo = initialCards.filter(card => card.status === 'TODO' && !card.isDeleted);
        const inProgress = initialCards.filter(card => card.status === 'IN_PROGRESS' && !card.isDeleted);
        const done = initialCards.filter(card => card.status === 'DONE' && !card.isDeleted);
        
        // Filter cards into Eisenhower quadrants
        const q1 = initialCards.filter(card => card.status === 'Q1' && !card.isDeleted);
        const q2 = initialCards.filter(card => card.status === 'Q2' && !card.isDeleted);
        const q3 = initialCards.filter(card => card.status === 'Q3' && !card.isDeleted);
        const q4 = initialCards.filter(card => card.status === 'Q4' && !card.isDeleted);
        
        // Filter deleted cards
        const deleted = initialCards.filter(card => card.isDeleted);
        
        // Set all cards
        const all = initialCards.filter(card => !card.isDeleted);
        
        // Update state
        setTodoCards(todo);
        setInProgressCards(inProgress);
        setDoneCards(done);
        setQ1Cards(q1);
        setQ2Cards(q2);
        setQ3Cards(q3);
        setQ4Cards(q4);
        setDeletedCards(deleted);
        setAllCards(all);
        
        // Clear any previous errors
        setError(null);
      } catch (err) {
        // Handle any errors during initialization
        console.error('Error initializing cards:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize cards'));
        toast.error('Error loading cards. Please try again.');
      }
    }
  }, [initialCards]);

  // Helper to get the specific state array and setter based on column ID
  const getListAndSetter = (columnId: string): [Card[], React.Dispatch<React.SetStateAction<Card[]>>] => {
    switch (columnId) {
      case 'TODO':
        return [todoCards, setTodoCards];
      case 'IN_PROGRESS':
        return [inProgressCards, setInProgressCards];
      case 'DONE':
        return [doneCards, setDoneCards];
      case 'Q1':
        return [q1Cards, setQ1Cards];
      case 'Q2':
        return [q2Cards, setQ2Cards];
      case 'Q3':
        return [q3Cards, setQ3Cards];
      case 'Q4':
        return [q4Cards, setQ4Cards];
      case 'ALL':
        return [allCards, setAllCards]; 
      case 'DELETED':
        return [deletedCards, setDeletedCards];
      default:
        return [todoCards, setTodoCards];
    }
  };

  // Handle card drag and drop
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    // If dropped outside a droppable area
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    try {
      // Find the source and destination lists
      const [sourceList, setSourceList] = getListAndSetter(source.droppableId);
      const [destList, setDestList] = getListAndSetter(destination.droppableId);

      // Get the card being moved
      const movedCard = sourceList[source.index];

      // Handle same list reordering
      if (source.droppableId === destination.droppableId) {
        const newList = [...sourceList];
        newList.splice(source.index, 1);
        newList.splice(destination.index, 0, movedCard);
        setSourceList(newList);

        // Update card order
        await updateCardOrder(newList);
        return;
      }

      // Handle moving between lists
      // Remove from source list
      const newSourceList = [...sourceList];
      newSourceList.splice(source.index, 1);
      setSourceList(newSourceList);

      // Add to destination list
      const newDestList = [...destList];
      newDestList.splice(destination.index, 0, {
        ...movedCard,
        status: destination.droppableId as CardStatus
      });
      setDestList(newDestList);

      // Update card status in database
      await updateCardServer(movedCard.id, destination.droppableId as CardStatus, destination.index);
    } catch (err) {
      // Handle drag-and-drop errors
      console.error('Error during drag and drop:', err);
      setError(err instanceof Error ? err : new Error('Failed to move card'));
      toast.error('Error moving card. Please try again.');
      
      // Refresh the board to get back to a consistent state
      window.location.reload();
    }
  };

  // Update card status and order on the server
  const updateCardServer = async (cardId: string, newStatus: CardStatus, newOrder: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await updateCardStatus(cardId, newStatus, undefined, newOrder);
      
      if (!result || 'error' in result) {
        throw new Error(result?.error?.message || 'Failed to update card status');
      }
      
      toast.success(`Card moved to ${newStatus}`);
    } catch (err) {
      console.error('Error updating card:', err);
      
      // Set error state
      setError(err instanceof Error ? err : new Error('Failed to update card status'));
      
      // Show error toast
      if (err instanceof Error && err.message) {
        toast.error(err.message);
      } else {
        toast.error('Failed to update card status');
      }
      
      // In a real application, you might want to revert the UI change here
      throw err; // Re-throw to allow component to recover
    } finally {
      setIsLoading(false);
    }
  };

  // Update multiple cards' order after a reordering
  const updateCardOrder = async (cards: Card[]) => {
    // This is a simplified example - in a real app you might want to batch these updates
    // or have a specialized server action for updating order
    setIsLoading(true);
    setError(null);
    
    try {
      // Store initial state for rollback
      const initialState = [...cards];
      
      // Track successful updates
      const updatedCardIds = new Set<string>();
      
      for (let i = 0; i < cards.length; i++) {
        const result = await updateCardStatus(cards[i].id, cards[i].status, undefined, i);
        
        if (!result || 'error' in result) {
          throw new Error(result?.error?.message || 'Failed to update card order');
        }
        
        updatedCardIds.add(cards[i].id);
      }
      
      toast.success('Card order updated');
    } catch (err) {
      console.error('Error updating card order:', err);
      
      // Set error state
      setError(err instanceof Error ? err : new Error('Failed to update card order'));
      
      // Show error toast
      if (err instanceof Error && err.message) {
        toast.error(err.message);
      } else {
        toast.error('Failed to update card order');
      }
      
      // In a real application, you might want to roll back changes here
      throw err; // Re-throw to allow component to recover
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle card deletion (soft delete)
  const handleDeleteCard = async (cardId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await softDeleteCard(cardId);
      
      if (!result || !result.success) {
        throw new Error('Failed to delete card');
      }
      
      toast.success('Card deleted');
      
      // Update local state (move to deleted cards or remove from all views)
      const cardToDelete = [
        ...todoCards, ...inProgressCards, ...doneCards,
        ...q1Cards, ...q2Cards, ...q3Cards, ...q4Cards
      ].find(card => card.id === cardId);
      
      if (cardToDelete) {
        // Remove from all regular lists
        setTodoCards(prev => prev.filter(card => card.id !== cardId));
        setInProgressCards(prev => prev.filter(card => card.id !== cardId));
        setDoneCards(prev => prev.filter(card => card.id !== cardId));
        setQ1Cards(prev => prev.filter(card => card.id !== cardId));
        setQ2Cards(prev => prev.filter(card => card.id !== cardId));
        setQ3Cards(prev => prev.filter(card => card.id !== cardId));
        setQ4Cards(prev => prev.filter(card => card.id !== cardId));
        setAllCards(prev => prev.filter(card => card.id !== cardId));
        
        // Add to deleted cards
        const deletedCard = {
          ...cardToDelete,
          isDeleted: true,
          deletedAt: new Date().toISOString()
        };
        setDeletedCards(prev => [...prev, deletedCard]);
      }
    } catch (err) {
      console.error('Error deleting card:', err);
      
      // Set error state
      setError(err instanceof Error ? err : new Error('Failed to delete card'));
      
      // Show error toast
      if (err instanceof Error && err.message) {
        toast.error(err.message);
      } else {
        toast.error('Failed to delete card');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Render the board based on the selected view
  const renderBoard = () => {
    // If there's an error, show error UI
    if (error) {
      return <KanbanBoardErrorFallback 
        error={error} 
        reset={() => {
          setError(null);
          window.location.reload();
        }} 
      />;
    }

    // Render different views based on the view prop
    if (view === 'kanban') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Column 
            title="TO DO" 
            cards={todoCards} 
            id="TODO" 
            onDeleteCard={handleDeleteCard}
          />
          <Column 
            title="IN PROGRESS" 
            cards={inProgressCards} 
            id="IN_PROGRESS" 
            onDeleteCard={handleDeleteCard}
          />
          <Column 
            title="DONE" 
            cards={doneCards} 
            id="DONE" 
            onDeleteCard={handleDeleteCard}
          />
        </div>
      );
    } else if (view === 'eisenhower') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Column 
            title="Important & Urgent (Q1)" 
            cards={q1Cards} 
            id="Q1" 
            onDeleteCard={handleDeleteCard}
            bgColor="bg-red-50"
            borderColor="border-red-200"
          />
          <Column 
            title="Important & Not Urgent (Q2)" 
            cards={q2Cards} 
            id="Q2" 
            onDeleteCard={handleDeleteCard}
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
          />
          <Column 
            title="Not Important & Urgent (Q3)" 
            cards={q3Cards} 
            id="Q3" 
            onDeleteCard={handleDeleteCard}
            bgColor="bg-orange-50"
            borderColor="border-orange-200"
          />
          <Column 
            title="Not Important & Not Urgent (Q4)" 
            cards={q4Cards} 
            id="Q4" 
            onDeleteCard={handleDeleteCard}
            bgColor="bg-gray-50"
            borderColor="border-gray-200"
          />
        </div>
      );
    } else if (view === 'all') {
      return (
        <div className="grid grid-cols-1 gap-4">
          <Column 
            title="ALL CARDS" 
            cards={allCards} 
            id="ALL" 
            onDeleteCard={handleDeleteCard}
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
          />
        </div>
      );
    } else if (view === 'deleted') {
      return (
        <div className="grid grid-cols-1 gap-4">
          <Column 
            title="DELETED" 
            cards={deletedCards} 
            id="DELETED" 
            onDeleteCard={() => {}} // No deletion for already deleted cards
            bgColor="bg-gray-50"
            borderColor="border-gray-200"
            isDeletedView={true}
          />
        </div>
      );
    }
    
    return null;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="relative">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-2 text-sm text-blue-700">Processing...</span>
          </div>
        )}
        
        {renderBoard()}
      </div>
    </DragDropContext>
  );
};

/**
 * Wrap the KanbanBoard component with an error boundary
 * This ensures any uncaught errors are handled gracefully
 */
export default function KanbanBoard({ initialCards, view }: KanbanBoardProps) {
  return (
    <ErrorBoundary fallback={KanbanBoardErrorFallback}>
      <KanbanBoardWithErrorHandling initialCards={initialCards} view={view} />
    </ErrorBoundary>
  );
}

  // Handle card deletion (soft delete)
