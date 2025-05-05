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
  /**
   * Whether to show importance/urgency controls for matrix mode
   */
  matrixMode?: boolean;
}

/**
 * Input component for creating new task cards
 */
export default function Input({ onCardCreated, matrixMode = false }: InputProps) {
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [importance, setImportance] = useState(false);
  const [urgency, setUrgency] = useState(false);
  
  /**
   * Handles the form submission
   */
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Pass importance and urgency when in matrix mode
      const newCard = await createCard(content, undefined, importance, urgency);
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
  
  // Determine which quadrant based on importance/urgency
  const getQuadrant = () => {
    if (importance && urgency) return { name: 'Q1: Urgent & Important', color: 'bg-red-100 border-red-300 text-red-800' };
    if (importance && !urgency) return { name: 'Q2: Important, Not Urgent', color: 'bg-purple-100 border-purple-300 text-purple-800' };
    if (!importance && urgency) return { name: 'Q3: Urgent, Not Important', color: 'bg-orange-100 border-orange-300 text-orange-800' };
    return { name: 'Q4: Not Urgent, Not Important', color: 'bg-gray-100 border-gray-300 text-gray-800' };
  };

  const quadrant = getQuadrant();

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

          {/* Eisenhower Matrix Controls */}
          {matrixMode && (
            <div className="mt-3 p-3 border rounded-md bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                {/* Importance Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="importance-toggle"
                    checked={importance}
                    onChange={() => setImportance(!importance)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="importance-toggle" className="ml-2 text-sm font-medium text-gray-700">
                    Important
                  </label>
                </div>

                {/* Urgency Toggle */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="urgency-toggle"
                    checked={urgency}
                    onChange={() => setUrgency(!urgency)}
                    className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="urgency-toggle" className="ml-2 text-sm font-medium text-gray-700">
                    Urgent
                  </label>
                </div>
                
                {/* Quadrant Display */}
                <div className={`px-3 py-1 text-sm rounded-md border ${quadrant.color}`}>
                  {quadrant.name}
                </div>
              </div>
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

