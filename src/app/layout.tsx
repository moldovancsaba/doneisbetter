import Providers from './components/Providers';
import SessionProvider from './components/SessionProvider';
import AuthButtons from './components/AuthButtons';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Providers>
          <SessionProvider>
            <header className="bg-white shadow-sm py-4">
              <div className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Done Is Better</h1>
                <AuthButtons />
              </div>
            </header>
            <main className="container mx-auto p-4 md:p-6">
              {children}
            </main>
          </SessionProvider>
        </Providers>
      </body>
    </html>
  )
}
