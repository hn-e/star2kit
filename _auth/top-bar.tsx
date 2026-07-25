'use client'

import { UserMenu } from './user-menu'
import { AuthForm } from './auth-form'
import { useBranding } from './branding-context'
import { useState, useCallback } from 'react'
import { Anonymous_Pro } from 'next/font/google'

const anonPro = Anonymous_Pro({ weight: '400', subsets: ['latin'] })

export function TopBar() {
  const [showAuth, setShowAuth] = useState(false)
  const { isOpen, toggle } = useBranding()

  const handleBrandingToggle = useCallback((e: React.MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    toggle(x, y)
  }, [toggle])

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-gray-100">
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-2.5">
              {/* <img src="/logo.png" alt="Kit Init" className="w-7 h-7 shrink-0" /> */}
              <span
                onClick={handleBrandingToggle}
                className={`text-2xl font-semibold text-gray-400 select-none cursor-pointer hover:text-gray-600 transition-colors duration-200 ${anonPro.className} ${isOpen ? '' : 'animate-pulse'}`}
              >
                kit init
                <span className={`inline-block ml-1 text-lg transition-transform duration-300 ${isOpen ? 'rotate-180 translate-y-0.5' : ''}`}>&#9662;</span>
              </span>
            </div>

            <UserMenu onLoginClick={() => setShowAuth(true)} />
          </div>
        </div>
      </div>

      {showAuth && (
        <AuthForm
          onSuccess={() => setShowAuth(false)}
          onClose={() => setShowAuth(false)}
        />
      )}
    </>
  )
}
