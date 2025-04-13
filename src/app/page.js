// Make sure to import the Input component and server actions
import Input from '@/components/Input'; // Adjust path if necessary
import { createCard, getCards } from '@/app/actions'; // Adjust path if necessary
import { Suspense } from 'react'; // Import Suspense for loading states

// Define the card item component (can be in a separate file)
function CardItem({ card }) {
  // Ensure createdAt is a Date object or parse the string
  const date = card.createdAt ? new Date(card.createdAt) : new Date();
  return (
    <div
      key={card.id}
      className="card" // Use class from globals.css
    >
      <p>{card.content}</p>
      <time className="card-time"> {/* Use class from globals.css */}
        {/* Format date safely */}
        {date.toLocaleString()}
      </time>
    </div>
  );
}

// Define the list component that fetches data
async function CardList() {
  // Fetch cards using the server action
  const cards = await getCards();

  if (!cards || cards.length === 0) {
    return <p className="text-center text-gray-500">No cards yet. Add one above!</p>;
  }

  return (
     <div className="card-list"> {/* Use class from globals.css */}
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
  );
}

// The main page component is now async to fetch data
export default async function Home() {

  return (
    // Use classes from globals.css for layout
    <main className="main-container">
      <div className="content-wrapper">
        <h1 className="text-2xl font-bold text-center mb-6">Done Is Better</h1>

        {/* Render the client Input component, passing the createCard server action */}
        <Input onSubmit={createCard} />

        {/* Use Suspense for loading state while fetching cards */}
        <Suspense fallback={<div className="text-center mt-8">Loading cards...</div>}>
           {/* Render the CardList component which fetches and displays cards */}
           <CardList />
        </Suspense>

      </div>
    </main>
  );
}
