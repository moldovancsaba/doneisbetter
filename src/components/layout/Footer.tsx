import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About DoneIsBetter</h3>
            <p className="text-gray-400">
              A privacy-focused image ranking application that helps users discover
              and rank images through an intuitive swipe and vote interface.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cards" className="text-gray-400 hover:text-white">
                  Cards
                </Link>
              </li>
              <li>
                <Link href="/play" className="text-gray-400 hover:text-white">
                  Play
                </Link>
              </li>
              <li>
                <Link href="/ranking" className="text-gray-400 hover:text-white">
                  Rankings
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">
                <a href="mailto:support@doneisbetter.com" className="hover:text-white">
                  support@doneisbetter.com
                </a>
              </li>
              <li className="text-gray-400">
                <a href="https://github.com/yourusername/doneisbetter" className="hover:text-white">
                  GitHub Repository
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {new Date().getFullYear()} DoneIsBetter. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
