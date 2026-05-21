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
      <div className="relative rounded-2xl w-full max-w-xs mx-4" style={{ animation: anim }} onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center mb-4">
            {step === 1 ? 'Sign in' : 'Check your email'}
          </p>

          {step === 1 ? (
            <div>
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
