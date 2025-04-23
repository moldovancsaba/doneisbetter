'use client';

import { useState } from 'react';
import { initialCards } from "./lib/data";
import Input from './components/Input';
import { Card } from './types/card';

/**
 * Home page component
 * Displays a list of task cards and provides ability to add new tasks
 * 
 * @returns JSX.Element
 */
export default function HomePage(): JSX.Element {
  // Initialize state with the default cards
  const [cards, setCards] = useState<Card[]>(initialCards);
  
  /**
   * Handler for adding a new card to the list
   * @param newCard - The newly created card from the Input component
   */
  const handleCardCreated = (newCard: Card): void => {
    setCards(prevCards => [newCard, ...prevCards]);
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Task Manager</h1>
        
        {/* Input component for adding new tasks */}
        <Input onCardCreated={handleCardCreated} />
        
        <section aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className="text-xl font-semibold mb-4">Your Tasks</h2>
          
          {cards.length === 0 ? (
            <p className="text-gray-500 text-center py-4" role="status">No tasks available</p>
          ) : (
            <ul 
              className="space-y-3" 
              role="list" 
              aria-label="Task list"
              aria-live="polite" // Announce changes when cards are added
            >
              {cards.map((card) => (
                <li 
                  key={card.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start">
                    <span className="text-gray-800">{card.content}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
