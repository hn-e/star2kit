'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { useBranding } from '@/_auth/branding-context'
import { SiJavascript, SiJquery, SiReact, SiVuedotjs, SiSvelte, SiSolid, SiFlask, SiExpress, SiFastapi, SiNextdotjs, SiDjango, SiSqlite, SiSupabase, SiPostgresql, SiAppwrite, SiMysql, SiMongodb, SiTailwindcss, SiBootstrap, SiBulma, SiClerk, SiAuth0, SiMailgun, SiMailtrap, SiSendgrid, SiMailchimp, SiStripe, SiRazorpay, SiPaypal } from 'react-icons/si'
import { FaAws, FaCloudflare } from 'react-icons/fa'

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

function AnimatedCounter({ end, suffix, label }: { end: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const duration = 1400
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      setCount(Math.floor(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
      else setCount(end)
    }
    requestAnimationFrame(animate)
  }, [visible, end])

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-white tabular-nums">
        {count}{suffix}
      </p>
      <p className="text-purple-200/50 text-xs mt-1.5 tracking-wide uppercase">{label}</p>
    </div>
  )
}

function StatsCounter() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-6">
      <AnimatedCounter end={12} suffix="+" label="Templates" />
      <AnimatedCounter end={30} suffix="+" label="Integrations" />
      <AnimatedCounter end={0} label="Telemetry" />
      <AnimatedCounter end={100} suffix="%" label="Open Source" />
    </div>
  )
}

const STACKS = [
  {
    front: { name: 'React', color: '#61DAFB' },
    back: { name: 'Express', color: '#000' },
    desc: 'Full-stack SPA with SQLite & Cloudflare R2',
  },
  {
    front: { name: 'Vue', color: '#4FC08D' },
    back: { name: 'Flask', color: '#000' },
    desc: 'Python-powered with Postgres & AWS S3',
  },
  {
    front: { name: 'SolidJS', color: '#2C4F7C' },
    back: { name: 'Express', color: '#000' },
    desc: 'Modern reactive SPA with Clerk auth',
  },
]

function StackCombinations() {
  return (
    <div>
      <p className="text-white/60 text-xs tracking-widest uppercase text-center mb-8">Popular Stacks</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STACKS.map((stack, i) => (
          <div
            key={i}
            className="bg-white/[0.06] rounded-xl p-5 border border-white/[0.08] hover:bg-white/[0.09] transition-colors duration-300"
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-white/80 text-sm font-semibold">{stack.front.name}</span>
              <span className="text-purple-300/60 text-xs">+</span>
              <span className="text-white/80 text-sm font-semibold">{stack.back.name}</span>
            </div>
            <p className="text-purple-200/40 text-xs text-center leading-relaxed">{stack.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function ProjectPreview() {
  const [line, setLine] = useState(0)
  const [prevLine, setPrevLine] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setPrevLine(line)
        setLine(prev => (prev + 1) % 3)
        setFading(false)
      }, 400)
    }, 3000)
    return () => clearInterval(interval)
  }, [line])

  const trees = [
    `my-project/\n├── client/          react + vite\n│   ├── src/\n│   ├── index.html\n│   ├── package.json\n│   └── vite.config.js\n├── server/          express api\n│   ├── routes/\n│   ├── app.js\n│   └── package.json\n├── .env.example\n├── docker-compose.yml\n└── README.md`,
    `my-project/\n├── client/          vue + vite\n│   ├── src/\n│   ├── index.html\n│   └── package.json\n├── server/          flask api\n│   ├── app.py\n│   ├── models.py\n│   └── requirements.txt\n├── .env.example\n└── README.md`,
    `my-project/\n├── client/          solidjs + vite\n│   ├── src/\n│   └── package.json\n├── server/          express api\n│   ├── routes/\n│   └── app.js\n├── .env.example\n└── README.md`,
  ]

  const highlights: Record<string, string> = {
    'react + vite': 'text-blue-400',
    'vue + vite': 'text-green-400',
    'solidjs + vite': 'text-purple-400',
    'express api': 'text-yellow-400',
    'flask api': 'text-yellow-400',
  }

  const renderTree = (tree: string) =>
    tree.split('\n').map((l, i) => {
      let hl = ''
      for (const [keyword, cls] of Object.entries(highlights)) {
        if (l.includes(keyword)) { hl = cls; break }
      }
      return <div key={i} className={hl || 'text-gray-400'}>{l}</div>
    })

  return (
    <div>
      <p className="text-white/60 text-xs tracking-widest uppercase text-center mb-8">What you get</p>
      <div className="bg-gray-950 rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08]">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 shrink-0" />
        </div>
        <div className="px-5 py-5 font-mono text-xs leading-relaxed h-[340px] transition-opacity duration-300" style={{ opacity: fading ? 0.4 : 1 }}>
          {renderTree(trees[fading ? prevLine : line])}
        </div>
      </div>
    </div>
  )
}

function QuickStart() {
  const [copied, setCopied] = useState(false)

  const code = `npm install kitinit\nkitinit init my-project\ncd my-project && npm run dev`

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <div>
      <p className="text-white/60 text-xs tracking-widest uppercase text-center mb-8">Quick start</p>
      <div className="bg-gray-950 rounded-xl border border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.08]">
          <span className="text-[11px] text-gray-500 font-mono tracking-wide">Terminal</span>
          <button onClick={handleCopy} className="text-[10px] text-purple-300/60 hover:text-purple-300 transition-colors tracking-wide">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="px-5 py-5 font-mono text-sm leading-relaxed">
          {code.split('\n').map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-gray-600 select-none shrink-0">{i + 1}</span>
              <span className="text-gray-300">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
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
        <div className="min-h-screen flex flex-col items-center px-6 py-20">
          <div className="min-h-screen flex flex-col items-center justify-center w-full max-w-4xl">
            <div className="w-full">
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

            <p className="text-center mt-5 text-[11px] tracking-widest uppercase text-purple-200/40">
              Free &middot; Open Source &middot; MIT
            </p>
          </div>
        </div>

        <div className="w-full overflow-hidden py-6 mb-16">
          <div className="animate-marquee flex gap-10 whitespace-nowrap opacity-50">
                <SiJavascript className="w-7 h-7 text-white shrink-0" />
                <SiJquery className="w-7 h-7 text-white shrink-0" />
                <SiReact className="w-7 h-7 text-white shrink-0" />
                <SiVuedotjs className="w-7 h-7 text-white shrink-0" />
                <SiSvelte className="w-7 h-7 text-white shrink-0" />
                <SiSolid className="w-7 h-7 text-white shrink-0" />
                <SiExpress className="w-7 h-7 text-white shrink-0" />
                <SiFlask className="w-7 h-7 text-white shrink-0" />
                <SiFastapi className="w-7 h-7 text-white shrink-0" />
                <SiNextdotjs className="w-7 h-7 text-white shrink-0" />
                <SiDjango className="w-7 h-7 text-white shrink-0" />
                <SiSqlite className="w-7 h-7 text-white shrink-0" />
                <SiSupabase className="w-7 h-7 text-white shrink-0" />
                <SiPostgresql className="w-7 h-7 text-white shrink-0" />
                <SiAppwrite className="w-7 h-7 text-white shrink-0" />
                <SiMysql className="w-7 h-7 text-white shrink-0" />
                <SiMongodb className="w-7 h-7 text-white shrink-0" />
                <FaCloudflare className="w-6 h-6 text-white shrink-0" />
                <FaAws className="w-6 h-6 text-white shrink-0" />
                <SiClerk className="w-7 h-7 text-white shrink-0" />
                <SiAuth0 className="w-7 h-7 text-white shrink-0" />
                <SiMailgun className="w-7 h-7 text-white shrink-0" />
                <SiMailtrap className="w-7 h-7 text-white shrink-0" />
                <SiSendgrid className="w-7 h-7 text-white shrink-0" />
                <SiMailchimp className="w-7 h-7 text-white shrink-0" />
                <SiStripe className="w-7 h-7 text-white shrink-0" />
                <SiRazorpay className="w-7 h-7 text-white shrink-0" />
                <SiPaypal className="w-7 h-7 text-white shrink-0" />
                <SiTailwindcss className="w-7 h-7 text-white shrink-0" />
                <SiBootstrap className="w-7 h-7 text-white shrink-0" />
                <SiBulma className="w-7 h-7 text-white shrink-0" />
                <SiJavascript className="w-7 h-7 text-white shrink-0" />
                <SiJquery className="w-7 h-7 text-white shrink-0" />
                <SiReact className="w-7 h-7 text-white shrink-0" />
                <SiVuedotjs className="w-7 h-7 text-white shrink-0" />
                <SiSvelte className="w-7 h-7 text-white shrink-0" />
                <SiSolid className="w-7 h-7 text-white shrink-0" />
                <SiExpress className="w-7 h-7 text-white shrink-0" />
                <SiFlask className="w-7 h-7 text-white shrink-0" />
                <SiFastapi className="w-7 h-7 text-white shrink-0" />
                <SiNextdotjs className="w-7 h-7 text-white shrink-0" />
                <SiDjango className="w-7 h-7 text-white shrink-0" />
                <SiSqlite className="w-7 h-7 text-white shrink-0" />
                <SiSupabase className="w-7 h-7 text-white shrink-0" />
                <SiPostgresql className="w-7 h-7 text-white shrink-0" />
                <SiAppwrite className="w-7 h-7 text-white shrink-0" />
                <SiMysql className="w-7 h-7 text-white shrink-0" />
                <SiMongodb className="w-7 h-7 text-white shrink-0" />
                <FaCloudflare className="w-6 h-6 text-white shrink-0" />
                <FaAws className="w-6 h-6 text-white shrink-0" />
                <SiClerk className="w-7 h-7 text-white shrink-0" />
                <SiAuth0 className="w-7 h-7 text-white shrink-0" />
                <SiMailgun className="w-7 h-7 text-white shrink-0" />
                <SiMailtrap className="w-7 h-7 text-white shrink-0" />
                <SiSendgrid className="w-7 h-7 text-white shrink-0" />
                <SiMailchimp className="w-7 h-7 text-white shrink-0" />
                <SiStripe className="w-7 h-7 text-white shrink-0" />
                <SiRazorpay className="w-7 h-7 text-white shrink-0" />
                <SiPaypal className="w-7 h-7 text-white shrink-0" />
                <SiTailwindcss className="w-7 h-7 text-white shrink-0" />
                <SiBootstrap className="w-7 h-7 text-white shrink-0" />
                <SiBulma className="w-7 h-7 text-white shrink-0" />
              </div>
        </div>

        <div className="w-full max-w-4xl pb-20">
          <div className="space-y-24">

            <StatsCounter />

            <StackCombinations />

            <ProjectPreview />

            <QuickStart />

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-purple-200/40">
              <span>No credit card required</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>No signup needed</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>Works offline</span>
              <span className="hidden sm:inline">&middot;</span>
              <span>MIT License</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-6 border border-white/5">
                <div className="text-white/80 mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Zero Config</h3>
                <p className="text-purple-200/50 text-xs leading-relaxed">No config files, no boilerplate hunt. Pick your stack and go.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-white/5">
                <div className="text-white/80 mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Full Stack</h3>
                <p className="text-purple-200/50 text-xs leading-relaxed">Frontend, backend, database, auth &mdash; one scaffolded project.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-white/5">
                <div className="text-white/80 mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">No Telemetry</h3>
                <p className="text-purple-200/50 text-xs leading-relaxed">Everything runs locally. No tracking, no analytics, no nonsense.</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 border border-white/5">
                <div className="text-white/80 mb-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">One Command</h3>
                <p className="text-purple-200/50 text-xs leading-relaxed">npm install kitinit. That&apos;s it. No global installs, no setup.</p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-8 pb-4">
              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-purple-200/40">
                <span>&copy; Kit Init</span>
                <a href="https://github.com/anomalyco/star2kit" className="hover:text-purple-200/70 transition-colors">GitHub</a>
                <span className="hover:text-purple-200/70 transition-colors cursor-pointer">Docs</span>
                <span className="hover:text-purple-200/70 transition-colors cursor-pointer">Privacy</span>
                <span className="hover:text-purple-200/70 transition-colors cursor-pointer">Terms</span>
              </div>
            </div>

          </div>
        </div>

      </div>
      )}
    </div>
  )
}
