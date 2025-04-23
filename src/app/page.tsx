import { initialCards } from "./lib/data";

/**
 * Home page component
 * Displays a list of task cards from the initialCards data
 * 
 * @returns JSX.Element
 */
export default function HomePage(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Task Manager</h1>
        
        <section aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className="text-xl font-semibold mb-4">Your Tasks</h2>
          
          {initialCards.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No tasks available</p>
          ) : (
            <ul className="space-y-3" role="list" aria-label="Task list">
              {initialCards.map((card) => (
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
