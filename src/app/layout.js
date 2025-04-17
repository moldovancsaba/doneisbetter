// src/app/layout.js
import './globals.css'
// Removed Urbanist font import

// Removed Urbanist font config object

export const metadata = {
  title: '#DONEISBETTER',
  description: 'Minimalist text card organizer',
}

export default function RootLayout({ children }) {
  return (
    // Use basic Tailwind font-sans or define in globals.css
    <html lang="en" className="font-sans">
      {/* Correct Head Structure */}
      <head>
        {/* Removed Material Symbols link */}
      </head>
      {/* Correct Body Structure */}
      <body>
        {children}
      </body>
    </html>
  )
}
