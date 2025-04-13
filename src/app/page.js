// Remove Card rendering logic from here, import CardList instead
import Input from '@/components/Input';
import CardList from '@/components/CardList'; // Import the new client component
import { createCard, getCards } from '@/app/actions';
import { Suspense } from 'react';

export default async function Home() {
  // Fetch initial 'active' cards on the server when the page loads
  // Note: Error handling for getCards could be added here if needed
  const initialCards = await getCards();

  return (
    <main className="main-container">
      <div className="content-wrapper">
        <h1 className="text-2xl font-bold text-center mb-6">Done Is Better</h1>

        {/* Input component for adding new cards */}
        <Input onSubmit={createCard} />

        {/* CardList is now a client component managing its state */}
        {/* We pass initialCards fetched on the server */}
        {/* Suspense isn't strictly necessary here anymore as CardList handles its own state,
            but can be kept for initial load indication if desired or removed.
            Let's keep it simple and remove it for now as CardList handles empty state.
         */}
         {/*
         <Suspense fallback={<div className="text-center mt-8">Loading cards...</div>}>
         */}
           <CardList initialCards={initialCards} />
         {/*
         </Suspense>
         */}

      </div>
    </main>
  );
}

// The CardItem and direct rendering logic have been moved to CardList.js and CardItem.js
