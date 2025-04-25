import type { Metadata } from "next";
import { Urbanist } from "next/font/google"; // Assuming Urbanist is still used
import "../styles/globals.css";
import Providers from "./components/Providers"; // Keep Providers for Toaster etc.
// Removed AuthButtons import

// Font setup
const urbanist = Urbanist({
  subsets: ['latin'],
  variable: '--font-urbanist',
  weight: ['300', '800']
});

export const metadata: Metadata = {
  title: "Done Is Better",
  description: "Simple Kanban Board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable}`}>
      <body>
        <Providers> {/* Keep Providers */}
          {children}
          {/* AuthButtons removed from here */}
        </Providers>
      </body>
    </html>
  );
}
