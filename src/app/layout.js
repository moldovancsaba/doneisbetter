import './globals.css'

export const metadata = {
  title: 'Done Is Better',
  description: 'Simple text card app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
