import { getCards, createCard } from './actions';
import { Suspense } from 'react';
import Input from '@/components/Input';

// Card component to display each item
function CardItem({ content, createdAt }: { content: string; createdAt: Date }) {
  const date = new Date(createdAt).toLocaleDateString();
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 border rounded-md shadow-sm">
      <p className="dark:text-white">{content}</p>
      <p className="mt-2 text-xs text-gray-500">{date}</p>
    </div>
  );
}

// Cards list component to fetch and display cards
async function CardsList() {
  try {
    const cards = await getCards();
    
    if (cards.length === 0) {
      return (
        <div className="p-4 text-center text-gray-500 border border-dashed rounded-md">
          No items yet. Add one above!
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {cards.map(card => (
          <CardItem 
            key={card.id} 
            content={card.content} 
            createdAt={card.createdAt} 
          />
        ))}
      </div>
    );
  } catch {
    return (
      <div className="p-4 text-center text-red-500 border border-red-200 rounded-md">
        Error loading items. Please try again.
      </div>
    );
  }
}

// Main page component
export default function Home() {
  return (
    <main className="max-w-md mx-auto p-4 mt-10">
      <h1 className="mb-6 text-2xl font-bold text-center">Done Is Better</h1>
      
      {/* Input field */}
      {/* Input field */}
      <Input onSubmit={createCard} />
      {/* Card list with loading state */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Items</h2>
        <Suspense fallback={<div className="text-center">Loading...</div>}>
          <CardsList />
        </Suspense>
      </div>
      
      <footer className="mt-12 mb-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Done Is Better</p>
      </footer>
    </main>
  );
}
