import { getCards } from '@/app/actions';
import { ICard } from '@/types';

/**
 * Card item component to display individual cards
 */
function CardItem({ card }: { card: ICard }) {
  // Format date to display in a readable format
  const formattedDate = new Date(card.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  return (
    <div className="w-full p-4 mb-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-all hover:shadow-md">
      <p className="text-gray-800 dark:text-gray-200">{card.content}</p>
      <p className="text-xs text-gray-500 mt-2">{formattedDate}</p>
    </div>
  );
}

/**
 * CardList server component to fetch and display cards from MongoDB
 */
export default async function CardList() {
  try {
    // Fetch cards using server action
    const cards = await getCards();
    
    // If no cards are found, display a message
    if (cards.length === 0) {
      return (
        <div className="w-full max-w-md mt-8 text-center p-8 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
          <p className="text-gray-500">No cards yet. Add your first one above!</p>
        </div>
      );
    }
    
    // Display the list of cards
    return (
      <div className="w-full max-w-md mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Cards</h2>
        <div className="space-y-4">
          {cards.map((card) => (
            <CardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching cards:', error);
    
    // Display error message
    return (
      <div className="w-full max-w-md mt-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p className="text-red-600 dark:text-red-400">
          Failed to load cards. Please try again later.
        </p>
      </div>
    );
  }
}
