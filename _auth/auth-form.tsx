'use client'

import { useState } from 'react'
import { createClient } from './client'

export function AuthForm({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [closing, setClosing] = useState(false)
  const supabase = createClient()

  const labelClass = 'block text-xs font-medium text-gray-500 mb-1'
  const inputClass = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white'
  const btnClass = 'w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-black text-white hover:bg-gray-800 active:scale-[0.98] cursor-pointer'

  const handleClose = () => {
    if (closing) return
    setClosing(true)
    setTimeout(onClose, 250)
  }

  const sendCode = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) { setError(error.message); setLoading(false); return }
    setLoading(false)
    setStep(2)
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const signInWithMicrosoft = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const verifyCode = async () => {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'email' })
    if (error) { setError(error.message); setLoading(false); return }
    setLoading(false)
    onSuccess()
  }

  const anim = closing ? 'fadeOut 0.25s ease-in forwards' : 'fadeIn 0.2s ease-out'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" style={{ animation: anim }} />
      <div className="relative bg-white rounded-2xl w-full max-w-xs mx-4" style={{ animation: anim }} onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center mb-4">
            {step === 1 ? 'Sign in' : 'Check your email'}
          </p>

          {step === 1 ? (
            <div>
              <button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={signInWithMicrosoft}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer mt-3"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <rect x="2" y="2" width="9.5" height="9.5" fill="#F25022" />
                  <rect x="12.5" y="2" width="9.5" height="9.5" fill="#7FBA00" />
                  <rect x="2" y="12.5" width="9.5" height="9.5" fill="#00A4EF" />
                  <rect x="12.5" y="12.5" width="9.5" height="9.5" fill="#FFB900" />
                </svg>
                Continue with Microsoft
              </button>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <label className={labelClass}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          ) : (
            <div>
              <p className="text-xs text-gray-500 text-center mb-4">
                Enter the code sent to <span className="font-medium text-gray-700">{email}</span>
              </p>
              <label className={labelClass}>Verification code</label>
              <input
                type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                placeholder="00000000"
                className={inputClass + ' text-center tracking-widest text-lg'}
                maxLength={8}
              />
            </div>
          )}

          {error && <p className="text-red-500 text-xs mt-3 text-center">{error}</p>}

          <div className="flex flex-col items-center gap-3 mt-4">
            <div className="w-[70%] relative">
              <button
                onClick={step === 1 ? sendCode : verifyCode}
                disabled={loading || (step === 1 ? !email : otp.length < 8)}
                className={btnClass + ' disabled:opacity-40'}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                {loading ? 'Loading...' : step === 1 ? 'Send code' : 'Verify'}
              </button>
            </div>
            {step === 2 && (
              <button onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                Wrong email? Go back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
