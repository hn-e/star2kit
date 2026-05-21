'use client'

import { useState } from 'react'
import { useUser } from './auth-context'
import { createClient } from './client'

export function UserMenu({ onLoginClick }: { onLoginClick?: () => void }) {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const supabase = createClient()

  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture
  const initial = user?.email?.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden transition-colors text-sm font-semibold ${user ? (avatar ? '' : 'bg-blue-600 text-white') : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
      >
        {user ? (
          avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : initial
        ) : (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[-1]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 bg-white rounded-lg shadow-lg border border-gray-100 w-66 overflow-hidden">
            {user ? (
              <div className="p-3 border-b border-gray-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 bg-blue-600 flex items-center justify-center text-white text-xs font-semibold">
                  {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : initial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.user_metadata?.name || user.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            ) : null}

            <div className="p-1.5">
              {user ? (
                <p
                  onClick={() => { supabase.auth.signOut(); setOpen(false) }}
                  className="px-3 py-2 text-sm rounded-lg cursor-pointer"
                >
                  Sign out
                </p>
              ) : (
                <p
                  onClick={() => { setOpen(false); onLoginClick?.() }}
                  className="px-3 py-2 text-sm rounded-lg cursor-pointer"
                >
                  Login / Sign Up
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
