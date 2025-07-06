import { Navigation } from '@/components/layout/Navigation';

export default function PlayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
<main className="flex-1 h-[calc(100vh-64px)] overflow-hidden">
        {children}
      </main>
    </>
  );
}
