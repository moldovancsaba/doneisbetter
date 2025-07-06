import { Navigation } from '@/components/layout/Navigation';

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-gray-800 touch-none">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <main className="flex-1 mt-16 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
