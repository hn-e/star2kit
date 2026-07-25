'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { useBranding } from '@/_auth/branding-context'

const AVAILABLE_OPTIONS: Record<string, string[]> = {
  frontend: ['javascript', 'jquery', 'react', 'vue', 'svelte', 'solidjs'],
  backend: ['flask', 'express', 'fastapi', 'nextjs', 'django'],
  database: ['none', 'sqlite', 'supabase', 'postgres', 'appwrite', 'mysql', 'mongodb'],
  storage: ['none', 'local', 'cloudflare r2', 'aws s3', 'supabase'],
  auth: ['none', 'clerk', 'auth0'],
}

const CYCLES: [string, string][][] = [
  [
    ['frontend', 'react'],
    ['backend', 'express'],
    ['database', 'sqlite'],
    ['storage', 'cloudflare r2'],
    ['auth', 'clerk'],
  ],
  [
    ['frontend', 'vue'],
    ['backend', 'flask'],
    ['database', 'postgres'],
    ['storage', 'aws s3'],
    ['auth', 'auth0'],
  ],
  [
    ['frontend', 'solidjs'],
    ['backend', 'express'],
    ['database', 'supabase'],
    ['auth', 'clerk'],
  ],
  [
    ['frontend', 'svelte'],
    ['backend', 'fastapi'],
    ['database', 'mongodb'],
    ['storage', 'local'],
    ['auth', 'auth0'],
  ],
  [
    ['frontend', 'react'],
    ['backend', 'django'],
    ['database', 'mysql'],
    ['storage', 'supabase'],
    ['auth', 'none'],
  ],
  [
    ['frontend', 'javascript'],
    ['backend', 'nextjs'],
    ['database', 'none'],
    ['auth', 'clerk'],
  ],
  [
    ['frontend', 'jquery'],
    ['backend', 'flask'],
    ['database', 'appwrite'],
    ['storage', 'cloudflare r2'],
    ['auth', 'auth0'],
  ],
]

type Phase = 'selecting' | 'generating' | 'done' | 'pause'

type AnimState = {
  runIndex: number
  phase: Phase
  typedLines: string[]
  currentLine: string
  generatingText: string
  doneText: string
}

export function BrandingOverlay() {
  const { isOpen, origin, isAnimating, finishAnimation } = useBranding()
  const showContent = isOpen || isAnimating
  const [copied, setCopied] = useState(false)
  const [anim, setAnim] = useState<AnimState>({
    runIndex: 0,
    phase: 'selecting',
    typedLines: [],
    currentLine: '',
    generatingText: '',
    doneText: '',
  })
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    if (!showContent) {
      clearTimeout(timeoutRef.current!)
      setAnim({
        runIndex: 0,
        phase: 'selecting',
        typedLines: [],
        currentLine: '',
        generatingText: '',
        doneText: '',
      })
      return
    }

    const state = {
      runIndex: 0,
      phase: 'selecting' as Phase,
      lineIndex: 0,
      selectionTick: 0,
      charIndex: 0,
      typedLines: [] as string[],
      currentLine: '',
      generatingText: '',
      doneText: '',
    }

    const rerender = () => {
      setAnim({
        runIndex: state.runIndex,
        phase: state.phase,
        typedLines: [...state.typedLines],
        currentLine: state.currentLine,
        generatingText: state.generatingText,
        doneText: state.doneText,
      })
    }

    const scheduleTick = (delay: number) => {
      timeoutRef.current = setTimeout(tick, delay)
    }

    const tick = () => {
      const cycle = CYCLES[state.runIndex % CYCLES.length]

      if (state.phase === 'pause') {
        timeoutRef.current = setTimeout(() => {
          state.runIndex++
          state.phase = 'selecting'
          state.lineIndex = 0
          state.selectionTick = 0
          state.charIndex = 0
          state.typedLines = []
          state.currentLine = ''
          state.generatingText = ''
          state.doneText = ''
          rerender()
          scheduleTick(300)
        }, 3500)
        return
      }

      if (state.phase === 'selecting') {
        if (state.lineIndex >= cycle.length) {
          state.phase = 'generating'
          state.charIndex = 0
          rerender()
          scheduleTick(500)
          return
        }

        const [prefix, chosenValue] = cycle[state.lineIndex]
        const options = AVAILABLE_OPTIONS[prefix]

        if (options.length <= 1) {
          const line = `  \u2713 ${prefix} \u2192 ${chosenValue}`
          state.typedLines.push(line)
          state.currentLine = ''
          state.lineIndex++
          state.selectionTick = 0
          rerender()
          scheduleTick(350)
          return
        }

        const totalCycles = 17

        if (state.selectionTick < totalCycles - 4) {
          const idx = state.selectionTick % options.length
          state.currentLine = `  ${prefix} \u25B8 ${options[idx]}`
          state.selectionTick++
          rerender()
          scheduleTick(55 + Math.random() * 20)
        } else if (state.selectionTick < totalCycles) {
          state.currentLine = `  ${prefix} \u25B8 ${chosenValue}`
          state.selectionTick++
          rerender()
          scheduleTick(130)
        } else {
          const line = `  \u2713 ${prefix} \u2192 ${chosenValue}`
          state.typedLines.push(line)
          state.currentLine = ''
          state.lineIndex++
          state.selectionTick = 0
          rerender()
          scheduleTick(500)
        }
        return
      }

      if (state.phase === 'generating') {
        const text = '\u26A1 Generating project...'
        if (state.charIndex < text.length) {
          state.charIndex++
          state.generatingText = text.slice(0, state.charIndex)
          rerender()
          scheduleTick(40 + Math.random() * 20)
        } else {
          state.phase = 'done'
          state.charIndex = 0
          rerender()
          scheduleTick(700)
        }
        return
      }

      if (state.phase === 'done') {
        const text = 'Done! Project scaffolded'
        if (state.charIndex < text.length) {
          state.charIndex++
          state.doneText = text.slice(0, state.charIndex)
          rerender()
          scheduleTick(50)
        } else {
          timeoutRef.current = setTimeout(() => {
            state.phase = 'pause'
            rerender()
            scheduleTick(0)
          }, 600)
        }
        return
      }
    }

    const startDelay = setTimeout(() => {
      rerender()
      scheduleTick(500)
    }, 900)

    return () => clearTimeout(startDelay)
  }, [showContent])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText('npm install kitinit')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

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
          <div className="w-full max-w-4xl">
            <div className="branding-terminal-wrapper bg-gray-950 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-white/10">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400 shrink-0" />
                <span className="w-3.5 h-3.5 rounded-full bg-yellow-400 shrink-0" />
                <span className="w-3.5 h-3.5 rounded-full bg-green-400 shrink-0" />
                <span className="ml-3 text-xs text-gray-500 font-mono">zsh</span>
              </div>

              <div className="px-8 py-10 font-mono text-base min-h-[360px]">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-green-400 shrink-0">~ $</span>
                  <span className="text-white">npx kitinit</span>
                  <span className="inline-block w-3 h-5 bg-purple-300 rounded-sm shrink-0" style={{ animation: 'typing-cursor 1s step-end infinite' }} />
                </div>

                <div className="space-y-1.5 ml-5">
                  {anim.typedLines.map((line, i) => (
                    <div key={i} className="text-gray-300">{line}</div>
                  ))}
                  {anim.currentLine && (
                    <div className="text-gray-300">{anim.currentLine}</div>
                  )}
                  {anim.generatingText && (
                    <div className="text-yellow-400">{anim.generatingText}</div>
                  )}
                  {anim.doneText && (
                    <div className="text-green-400">{anim.doneText}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center mt-6">
              <button
                onClick={handleCopy}
                className="group flex rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-200"
              >
                <span className="flex items-center gap-2 px-5 py-3 bg-white/10">
                  <code className="text-purple-200 text-sm font-mono">npm install kitinit</code>
                </span>
                <span className="flex items-center justify-center px-3.5 bg-white/15 group-hover:bg-white/20 transition-colors border-l border-white/10">
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-300">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
