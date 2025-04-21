export interface Card {
  id: string;
  content: string;
  createdAt: string;
  position: { x: number; y: number };
}

export const initialCards: Card[] = [
  {
    id: 'card-1',
    content: 'Take out the trash',
    createdAt: '2025-04-21T08:00:00',
    position: { x: 400, y: 250 },
  },
  {
    id: 'card-2',
    content: 'Finish lesson plan',
    createdAt: '2025-04-21T12:00:00',
    position: { x: 600, y: 400 },
  },
];

import { useState, useEffect } from 'react';

export default function Page() {
  const [cards, setCards] = useState<Card[]>(initialCards);

  // Hydrate from localStorage if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cards');
      if (saved) {
        try {
          setCards(JSON.parse(saved));
        } catch (e) {
          // Ignore errors and use initialCards
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist cards to localStorage whenever changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cards', JSON.stringify(cards));
    }
  }, [cards]);

  return (
    <main>
      <CardCanvas cards={cards} onCardsChange={setCards} />
    </main>
  );
}
      <pre>{JSON.stringify(cards, null, 2)}</pre>
    </main>
  );
}
