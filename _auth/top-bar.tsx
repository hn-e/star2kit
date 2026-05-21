'use client'

import { UserMenu } from './user-menu'
import { AuthForm } from './auth-form'
import { useState } from 'react'

export function TopBar() {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-blue-600 shrink-0" />
              <span className="text-sm font-semibold text-gray-900">StarterKit</span>
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
