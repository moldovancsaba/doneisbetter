'use client';

import { useState, FormEvent } from 'react';
import { createCard } from '@/lib/actions';
import { Card } from '../types/card';

/**
 * Button component with loading state for form submission
 */
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button
      type="submit"
      aria-disabled={isSubmitting}
      disabled={isSubmitting}
      className={`px-4 py-2 rounded-md text-white font-medium 
        ${isSubmitting 
          ? 'bg-blue-300 cursor-not-allowed' 
          : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
        } transition-colors`}
    >
      {isSubmitting ? 'Adding...' : 'Add Task'}
    </button>
  );
}

interface InputProps {
  /**
   * Callback function that receives the newly created card
   */
  onCardCreated?: (card: Card) => void;
}

/**
 * Input component for creating new task cards
 */
export default function Input({ onCardCreated }: InputProps) {
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handles the form submission
   */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      const newCard = await createCard(content);
      setContent(''); // Clear input on success
      
      // Notify parent component about the new card
      if (onCardCreated) {
        onCardCreated(newCard);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="w-full mb-6">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col">
          <label 
            htmlFor="task-input" 
            className="font-medium text-gray-700 mb-1"
          >
            New Task
          </label>
          
          <input
            id="task-input"
            type="text"
            placeholder="Add a new task..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            aria-required="true"
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? "input-error" : undefined}
            className={`px-3 py-2 border rounded-md focus:outline-none focus:ring-2 
              ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
          />
          
          {error && (
            <div id="input-error" className="mt-1 text-sm text-red-600" role="alert">
              {error}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <SubmitButton isSubmitting={isSubmitting} />
        </div>
      </form>
    </div>
  );
}

