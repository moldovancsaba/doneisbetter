// src/app/page.js
import Input from '@/components/Input';
import KanbanBoard from '@/components/KanbanBoard';
import { createCard, getCards } from '@/app/actions';

export default async function Home() {
  // Fetch ALL cards now on the server
  let allCards = [];
  try {
      allCards = await getCards();
  } catch(error) {
      console.error("Failed to fetch initial cards:", error);
      // You could potentially pass an error state to KanbanBoard or display a message here
  }

  return (
    // Single main container
    <main className="main-container">
      {/* Single content wrapper */}
      <div className="content-wrapper-kanban">

        {/* Title using custom CSS classes */}
        <h1 className="page-title">
           <span className="title-bold">#DONE</span>
           <span className="title-light">ISBETTER</span>
        </h1>

        {/* Input Area using custom CSS class */}
        <div className="input-wrapper">
            <Input onSubmit={createCard} />
        </div>
        <KanbanBoard initialCards={allCards} />

      {/* Close content wrapper */}
      </div>
    {/* Close main container */}
    </main>
  ); // End of return statement
} // End of Home component function
