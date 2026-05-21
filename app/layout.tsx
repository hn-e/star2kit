import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/_auth/auth-context'
import { TopBar } from '@/_auth/top-bar'

export const metadata: Metadata = {
  title: 'StarterKit',
  description: 'Generate a custom project boilerplate',
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
