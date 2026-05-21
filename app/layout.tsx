import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/_auth/auth-context'
import { TopBar } from '@/_auth/top-bar'

export const metadata: Metadata = {
  title: 'Kit Init - Starter Kit to initialize your project',
  description: 'kit init before git init',
  icons: '/favicon.png',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <TopBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
