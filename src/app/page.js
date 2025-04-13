import Input from '@/components/Input';
// MODIFIED: Import KanbanBoard instead of CardList
import KanbanBoard from '@/components/KanbanBoard';
import { createCard, getCards } from '@/app/actions';
import { Suspense } from 'react'; // Keep Suspense if KanbanBoard itself might be heavy initially

export default async function Home() {
  // Fetch ALL cards now on the server
  // Add basic error handling for the initial fetch
  let allCards = [];
  try {
      allCards = await getCards();
  } catch(error) {
      console.error("Failed to fetch initial cards:", error);
      // Optionally render an error message on the page
  }


  return (
    <main className="main-container">
      {/* Content wrapper might need adjustment for 3 columns */}
      <div className="content-wrapper-kanban"> {/* Using a new class potentially */}
        <h1 className="text-2xl font-bold text-center mb-6">Done Is Better</h1>

        {/* Input component remains the same */}
        <Input onSubmit={createCard} />

        {/* MODIFIED: Render KanbanBoard, passing all fetched cards */}
        {/* Add margin top for separation */}
        <div className="mt-8">
           {/* Wrap KanbanBoard in Suspense if it might suspend during initial render */}
           <Suspense fallback={<div className="text-center">Loading board...</div>}>
              <KanbanBoard initialCards={allCards} />
           </Suspense>
        </div>

      </div>
    </main>
  );
}

// The CardItem and direct rendering logic have been moved to CardList.js and CardItem.js
