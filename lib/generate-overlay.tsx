'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface TreeNode { name: string; type: 'folder' | 'file'; children?: TreeNode[] }

const TREE: TreeNode[] = [{
  name: 'my-project', type: 'folder', children: [
    { name: 'client', type: 'folder', children: [
      { name: 'src', type: 'folder', children: [
        { name: 'pages', type: 'folder', children: [
          { name: 'Home.tsx', type: 'file' }, { name: 'Login.tsx', type: 'file' },
        ] },
        { name: 'App.tsx', type: 'file' }, { name: 'main.tsx', type: 'file' },
      ] },
      { name: 'package.json', type: 'file' }, { name: 'tsconfig.json', type: 'file' }, { name: 'vite.config.ts', type: 'file' },
    ] },
    { name: 'server', type: 'folder', children: [
      { name: 'src', type: 'folder', children: [
        { name: 'index.ts', type: 'file' }, { name: 'db.ts', type: 'file' },
        { name: 'routes', type: 'folder', children: [
          { name: 'push.ts', type: 'file' }, { name: 'list.ts', type: 'file' },
        ] },
      ] },
      { name: 'package.json', type: 'file' }, { name: 'tsconfig.json', type: 'file' },
    ] },
    { name: '.env', type: 'file' }, { name: 'README.md', type: 'file' }, { name: 'docker-compose.yml', type: 'file' },
  ],
}]

interface FlatItem { path: string; name: string; type: 'folder' | 'file'; depth: number }

function flattenTree(nodes: TreeNode[], parentPath = ''): FlatItem[] {
  const result: FlatItem[] = []
  for (const node of nodes) {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name
    result.push({ path: currentPath, name: node.name, type: node.type, depth: parentPath.split('/').filter(Boolean).length })
    if (node.children) result.push(...flattenTree(node.children, currentPath))
  }
  return result
}

const ALL_ITEMS = flattenTree(TREE)

function assignTreeDelays(nodes: TreeNode[], parentPath = '', parentDelay = 0): { path: string; delay: number }[] {
  const result: { path: string; delay: number }[] = []
  for (const node of nodes) {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name
    const nodeDelay = parentDelay + 1000 + Math.random() * 2000
    result.push({ path: currentPath, delay: nodeDelay })
    if (node.children) result.push(...assignTreeDelays(node.children, currentPath, nodeDelay))
  }
  return result
}

function FolderIcon() {
  return <svg className="w-4 h-4 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
}

function FileIcon({ name }: { name: string }) {
  if (name.endsWith('.ts') || name.endsWith('.tsx')) return <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h18v18H3V3zm16 4H5v2h14V7zm0 4H5v2h14v-2zm0 4H5v2h14v-2z"/></svg>
  if (name.endsWith('.json')) return <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm2 4v2h10V7H7zm0 4v2h10v-2H7zm0 4v2h7v-2H7z"/></svg>
  if (name.startsWith('.env')) return <svg className="w-4 h-4 text-yellow-600 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h6v2H8v-2z"/></svg>
  if (name.endsWith('.yml') || name.endsWith('.yaml') || name.endsWith('.md')) return <svg className="w-4 h-4 text-orange-500 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M4 4h16v16H4V4zm2 2v12h12V6H6zm2 2h8v2H8V8zm0 4h8v2H8v-2zm0 4h4v2H8v-2z"/></svg>
  return <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h8l6 6v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm7 1.5V9h5.5L13 3.5z"/></svg>
}

interface GenerateOverlayProps {
  open: boolean
  onReady: () => void
}

export default function GenerateOverlay({ open, onReady }: GenerateOverlayProps) {
  const [revealedOrder, setRevealedOrder] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => {
    if (!open) {
      clearTimers()
      setRevealedOrder([])
      setDone(false)
      return
    }

    setRevealedOrder([])
    setDone(false)

    const scheduled = assignTreeDelays(TREE)
    scheduled.sort((a, b) => a.delay - b.delay)

    const timers: ReturnType<typeof setTimeout>[] = []
    for (const { path, delay } of scheduled) {
      const t = setTimeout(() => {
        setRevealedOrder(prev => [...prev, path])
      }, delay)
      timers.push(t)
    }

    const lastDelay = scheduled.length > 0 ? scheduled[scheduled.length - 1].delay : 0
    const doneT = setTimeout(() => {
      setDone(true)
      onReady()
    }, lastDelay + 500)
    timers.push(doneT)

    timersRef.current = timers

    return () => { timers.forEach(clearTimeout) }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  const revealedSet = new Set(revealedOrder)

  if (!open) return null

  return (
    <div className="animate-overlay-enter flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <span className="text-xs text-gray-400 font-mono ml-2">my-project — File Tree</span>
      </div>

      <div className="p-3 font-mono text-[13px] flex-1 overflow-y-auto min-h-0">
        <div className="text-[11px] text-gray-400 mb-2 px-2">
          {!done ? (
            <span className="text-green-600 font-medium">Generating project structure...</span>
          ) : (
            <span className="text-green-700 font-medium flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Project generated — {ALL_ITEMS.length} files created
            </span>
          )}
        </div>

        {ALL_ITEMS.map((item) => {
          const revealed = revealedSet.has(item.path)
          return (
            <div
              key={item.path}
              className="transition-all duration-500 ease-out overflow-hidden"
              style={{
                maxHeight: revealed ? '36px' : '0px',
                opacity: revealed ? 1 : 0,
              }}
            >
              <div
                className="flex items-center gap-1.5 py-0.5 px-2 rounded"
                style={{ paddingLeft: `${12 + item.depth * 16}px` }}
              >
                {item.type === 'folder' ? <FolderIcon /> : <FileIcon name={item.name} />}
                <span className={`text-sm truncate ${revealed ? 'text-gray-700 font-medium' : 'text-gray-300'}`}>
                  {item.name}
                </span>
              </div>
            </div>
          )
        })}

        {!done && revealedOrder.length < ALL_ITEMS.length && (
          <div className="flex items-center gap-1.5 px-2 py-0.5" style={{ paddingLeft: '16px' }}>
            <span className="w-2 h-4 bg-gray-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}
