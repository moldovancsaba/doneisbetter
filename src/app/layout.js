// src/app/layout.js
import './globals.css'
// Re-import Urbanist font
import { Urbanist } from 'next/font/google'

// Configure font object with variable
const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '800'], // Request needed weights
  display: 'swap',
  variable: '--font-urbanist' // Define CSS variable
})

export const metadata = {
  title: '#DONEISBETTER',
  description: 'Minimalist text card organizer',
}

export default function RootLayout({ children }) {
  return (
    // Apply font variable to html tag
    <html lang="en" className={urbanist.variable}>
      <body>{children}</body>
    </html>
  )
}
