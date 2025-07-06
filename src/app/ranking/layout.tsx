import { Navigation } from '@/components/layout/Navigation';

export default function RankingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation />
      <main className="flex-1">{children}</main>
    </>
  );
}
