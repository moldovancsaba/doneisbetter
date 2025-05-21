import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-bold mb-10 text-center">doneisbetter – Swipe Prototype</h1>
      
      <div className="flex flex-col w-full max-w-xs gap-4">
        <Link href="/swipe" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg text-xl text-center transition-colors duration-200 shadow-md hover:shadow-lg">
          SWIPE
        </Link>
        
        <Link href="/admin" className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg text-xl text-center transition-colors duration-200 shadow-md hover:shadow-lg">
          ADMIN
        </Link>
      </div>
    </div>
  );
}
