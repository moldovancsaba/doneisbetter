import Providers from './components/Providers';
import AuthProvider from './components/SessionProvider';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
          <Providers /> {/* For Toaster */}
        </AuthProvider>
      </body>
    </html>
  )
}
