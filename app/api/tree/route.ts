import { NextRequest } from 'next/server'
import path from 'path'
import fs from 'fs'
import type { ProjectOptions } from '@/lib/types'

const TEMPLATES = path.join(process.cwd(), 'lib', 'templates')

function collectStaticFiles(dirRel: string, destPrefix: string): string[] {
  const full = path.join(TEMPLATES, dirRel)
  if (!fs.existsSync(full)) return []
  const entries = fs.readdirSync(full, { recursive: true }) as string[]
  return entries
    .filter(e => fs.statSync(path.join(full, e)).isFile())
    .map(e => path.posix.join(destPrefix, e))
}

function collectDynamicFiles(options: ProjectOptions): string[] {
  const { frontend, backend, sqlite, storage, auth } = options
  const files: string[] = [
    'server/package.json',
    'server/.env',
    'client/.env',
  ]
  if (backend === 'express') {
    files.push('server/src/index.ts')
  } else {
    files.push('server/app.py', 'server/requirements.txt')
  }
  if (frontend === 'react') {
    files.push('client/src/App.tsx')
  } else {
    files.push('client/src/main.ts')
    files.push('client/src/router/index.ts')
  }
  return files
}

function pathsToTree(paths: string[]): { name: string; type: 'folder' | 'file'; children?: unknown[] }[] {
  const root: { name: string; type: 'folder' | 'file'; children?: unknown[] }[] = []
  for (const p of paths) {
    const parts = p.split('/')
    let current = root
    for (let i = 0; i < parts.length; i++) {
      const isFile = i === parts.length - 1
      let node = current.find(n => n.name === parts[i])
      if (!node) {
        node = { name: parts[i], type: isFile ? 'file' : 'folder' }
        if (!isFile) node.children = []
        current.push(node)
      }
      if (!isFile) {
        if (!node.children) node.children = []
        current = node.children as { name: string; type: 'folder' | 'file'; children?: unknown[] }[]
      }
    }
  }
  return root
}

function sortTree(nodes: { name: string; type: 'folder' | 'file'; children?: unknown[] }[]) {
  nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1
    return a.name.localeCompare(b.name)
  })
  for (const n of nodes) {
    if (n.children) sortTree(n.children as { name: string; type: 'folder' | 'file'; children?: unknown[] }[])
  }
}

export async function POST(req: NextRequest) {
  const opts: ProjectOptions = await req.json()
  const { frontend, backend, sqlite, storage, auth } = opts
  const hasStorage = storage !== null
  const hasAuth = auth !== null

  // Collect all static template files the same way generateProject does
  const allPaths: string[] = [
    ...collectStaticFiles('base', ''),
    ...collectStaticFiles(`${backend}/server`, 'server'),
    ...collectStaticFiles(`${frontend}/client`, 'client'),
  ]

  if (sqlite) {
    allPaths.push(
      ...collectStaticFiles(`sqlite/${backend}/server`, 'server'),
      ...collectStaticFiles(`sqlite/${frontend}/client/src/pages`, 'client/src/pages'),
    )
  }

  if (hasStorage) {
    allPaths.push(
      ...collectStaticFiles(`storage/${storage}/${backend}/server`, 'server'),
      ...collectStaticFiles(`storage/${storage}/${frontend}/client/src/pages`, 'client/src/pages'),
    )
  }

  if (hasAuth) {
    allPaths.push(
      ...collectStaticFiles(`auth/${auth}/${frontend}/client/src/pages`, 'client/src/pages'),
    )
  }

  // Dynamic files replace any template files with the same name
  const dynamicFiles = collectDynamicFiles(opts)
  const dynamicSet = new Set(dynamicFiles)
  const finalPaths = [...allPaths.filter(p => !dynamicSet.has(p)), ...dynamicFiles]

  const tree = pathsToTree(finalPaths)
  sortTree(tree)

  return Response.json(tree)
}
