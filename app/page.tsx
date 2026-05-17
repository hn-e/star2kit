'use client'

import { useState } from 'react'

type Frontend = 'react' | 'vue'

export default function Home() {
  const [frontend, setFrontend] = useState<Frontend>('react')
  const [sqlite, setSqlite] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frontend, sqlite }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'project.zip'
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ maxWidth: 640, margin: '4rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>StarterKit</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Pick your stack and download a ready-to-run project.
      </p>

      <Section title="Step 1 — Frontend">
        <CardGrid>
          <Card selected={frontend === 'react'} onClick={() => setFrontend('react')}>
            <strong>React</strong>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>v19 + Vite</span>
          </Card>
          <Card selected={frontend === 'vue'} onClick={() => setFrontend('vue')}>
            <strong>Vue</strong>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>v3 + Vite</span>
          </Card>
        </CardGrid>
      </Section>

      <Section title="Step 2 — Backend">
        <div style={{
          padding: '1rem',
          background: '#eef2ff',
          borderRadius: 8,
          border: '2px solid #c7d2fe',
          color: '#4338ca',
          fontSize: '0.9rem',
        }}>
          Express — port 3001
        </div>
      </Section>

      <Section title="Step 3 — Database">
        <CardGrid>
          <Card selected={!sqlite} onClick={() => setSqlite(false)}>
            <strong>None</strong>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>No database</span>
          </Card>
          <Card selected={sqlite} onClick={() => setSqlite(true)}>
            <strong>SQLite</strong>
            <span style={{ fontSize: '0.8rem', color: '#666' }}>better-sqlite3</span>
          </Card>
        </CardGrid>
      </Section>

      <button
        onClick={handleDownload}
        disabled={loading}
        style={{
          marginTop: '2rem',
          padding: '0.75rem 2rem',
          fontSize: '1rem',
          fontWeight: 600,
          background: loading ? '#94a3b8' : '#2563eb',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Generating...' : 'Download project.zip'}
      </button>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem', color: '#374151' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem' }}>{children}</div>
  )
}

function Card({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        padding: '1rem',
        border: `2px solid ${selected ? '#2563eb' : '#d1d5db'}`,
        borderRadius: 8,
        background: selected ? '#eff6ff' : '#fff',
        cursor: 'pointer',
        fontSize: '0.95rem',
        textAlign: 'center',
      }}
    >
      {children}
    </button>
  )
}
