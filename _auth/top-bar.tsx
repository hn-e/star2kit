'use client'

import { UserMenu } from './user-menu'
import { AuthForm } from './auth-form'
import { useState } from 'react'
import { Anonymous_Pro } from 'next/font/google'

const anonPro = Anonymous_Pro({ weight: '400', subsets: ['latin'] })

export function TopBar() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-2.5">
              {/* <img src="/logo.png" alt="Kit Init" className="w-7 h-7 shrink-0" /> */}
              <span className={`text-2xl font-semibold animate-pulse text-gray-400 select-none ${anonPro.className}`}>kit init</span>
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
