import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/_auth/auth-context'
import { BrandingProvider } from '@/_auth/branding-context'
import { TopBar } from '@/_auth/top-bar'
import { BrandingOverlay } from '@/components/branding-overlay'

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
          <BrandingProvider>
            <TopBar />
            <BrandingOverlay />
            {children}
          </BrandingProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
