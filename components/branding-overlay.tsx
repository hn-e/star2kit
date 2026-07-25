'use client'

import { useEffect, useCallback, useState } from 'react'
import { useBranding } from '@/_auth/branding-context'

export function BrandingOverlay() {
  const { isOpen, origin, isAnimating, finishAnimation } = useBranding()
  const showContent = isOpen || isAnimating
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText('npx kitinit')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const handleTransitionEnd = useCallback((e: React.TransitionEvent) => {
    if (e.propertyName === 'clip-path') {
      finishAnimation()
    }
  }, [finishAnimation])

  const overlayStyle = origin
    ? {
        clipPath: isOpen
          ? `circle(150vmax at ${origin.x}px ${origin.y}px)`
          : `circle(0px at ${origin.x}px ${origin.y}px)`,
      }
    : undefined

  return (
    <div
      className={`branding-overlay${isOpen ? ' open' : ''}`}
      style={overlayStyle}
      onTransitionEnd={handleTransitionEnd}
    >
      {showContent && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <div className="w-full max-w-3xl">
            <div className="branding-terminal-wrapper bg-gray-950 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400 shrink-0" />
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 shrink-0" />
                <span className="w-3.5 h-3.5 rounded-full bg-green-400 shrink-0" />
                <span className="ml-3 text-xs text-gray-500 font-mono">zsh</span>
              </div>

              <div className="px-8 py-10 font-mono text-base">
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-green-400 shrink-0">~ $</span>
                  <span className="text-white">npx kitinit</span>
                  <span className="inline-block w-3 h-5 bg-purple-300 rounded-sm shrink-0" style={{ animation: 'typing-cursor 1s step-end infinite' }} />
                </div>

                <div className="branding-tagline text-center py-6">
                  <p className="text-5xl font-bold text-purple-300 tracking-tight leading-tight">kit init before git init</p>
                </div>

                <div className="branding-subtitle text-center px-4">
                  <p className="text-gray-400 text-base leading-relaxed">
                    The fastest way to scaffold your full-stack project. Choose your stack and ship today.
                  </p>
                </div>
              </div>
            </div>

            <div className="branding-subtitle flex items-center justify-center mt-6">
              <button
                onClick={handleCopy}
                className="flex items-center gap-3 px-5 py-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl transition-all duration-200 group"
              >
                <code className="text-purple-200 text-sm font-mono">npx kitinit</code>
                <span className="text-[10px] tracking-wide text-purple-300/60 group-hover:text-purple-300/90 transition-colors">
                  {copied ? 'Copied!' : 'Click to copy'}
                </span>
              </button>
            </div>

            <div className="text-center mt-8">
              <p className="text-purple-200/50 text-sm tracking-wide">
                scroll to start building &darr;
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
