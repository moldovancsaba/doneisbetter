import Input from '@/components/Input';
import KanbanBoard from '@/components/KanbanBoard';
import { createCard, getCards } from '@/app/actions';

// Type definitions
export interface Card {
  id: string;
  content: string;
  status: 'active' | 'done' | 'deleted' | 'decide';
  order: number;
  createdAt: string;
}

export default async function Home() {
  // Fetch cards server-side
  let cards: Card[] = [];
  
  try {
    cards = await getCards();
  } catch (error) {
    console.error("Failed to fetch initial cards:", error);
    // Error is handled gracefully - empty array will be used
  }

  return (
    <main className="main-container">
      <div className="content-wrapper-kanban">
        <h1 className="page-title">
          <span className="title-bold">#️⃣DONE</span>
          <span className="title-light">ISBETTER</span>
        </h1>

        <div className="input-wrapper">
          <Input onSubmit={createCard} />
        </div>
        
        <KanbanBoard initialCards={cards} />
      </div>
    </main>
  );
}

