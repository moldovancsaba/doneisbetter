// src/app/layout.js
import './globals.css'
import { Urbanist } from 'next/font/google'

const urbanist = Urbanist({
  subsets: ['latin'],
  weight: ['300', '800'],
  display: 'swap',
  variable: '--font-urbanist'
})

export const metadata = {
  title: '#DONEISBETTER',
  description: 'Minimalist text card organizer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={urbanist.variable}>
      {/* Correct Head Structure */}
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      {/* Correct Body Structure */}
      <body>
        {children}
      </body>
    </html>
  )
}
