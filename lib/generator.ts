import JSZip from 'jszip'
import path from 'path'
import fs from 'fs'
import type { ProjectOptions } from './types'

const TEMPLATES = path.join(process.cwd(), 'lib', 'templates')

export async function generateProject(options: ProjectOptions): Promise<Buffer> {
  const zip = new JSZip()
  const { frontend, backend, sqlite } = options

  function add(srcRel: string, destRel: string) {
    const full = path.join(TEMPLATES, srcRel)
    if (fs.existsSync(full)) zip.file(destRel, fs.readFileSync(full, 'utf-8'))
  }

  function addDir(dirRel: string, destPrefix: string) {
    const full = path.join(TEMPLATES, dirRel)
    if (!fs.existsSync(full)) return
    const entries = fs.readdirSync(full, { recursive: true }) as string[]
    for (const e of entries) {
      const f = path.join(full, e)
      if (fs.statSync(f).isFile()) {
        zip.file(path.join(destPrefix, e), fs.readFileSync(f, 'utf-8'))
      }
    }
  }

  // 1. Base
  addDir('base', '')

  // 2. Server
  addDir(`${backend}/server`, 'server')

  // 3. Frontend
  addDir(`${frontend}/client`, 'client')

  // 4. SQLite
  if (sqlite) {
    addDir(`sqlite/${backend}/server`, 'server')
    addDir(`sqlite/${frontend}/client/src/pages`, 'client/src/pages')
  }

  // 5. Dynamic files
  if (backend === 'express') {
    zip.file('server/package.json', generateServerPkg())
  }
  if (frontend === 'react') {
    zip.file('client/src/App.tsx', generateReactApp(sqlite))
  } else {
    zip.file('client/src/router/index.ts', generateVueRouter(sqlite))
  }

  return zip.generateAsync({ type: 'nodebuffer' })
}

function generateServerPkg(): string {
  return JSON.stringify({
    name: 'server',
    private: true,
    type: 'module',
    scripts: { dev: 'tsx watch src/index.ts' },
    dependencies: { express: '^4.21.0', cors: '^2.8.5' },
    devDependencies: {
      '@types/express': '^5.0.0',
      '@types/cors': '^2.8.17',
      tsx: '^4.19.0',
      typescript: '^5.0.0',
    },
  }, null, 2)
}

function generateReactApp(sqlite: boolean): string {
  const lines: string[] = [
    `import { Routes, Route, Link } from 'react-router-dom'`,
    `import Home from './pages/Home'`,
  ]
  const routes: string[] = [
    `<Route path="/" element={<Home />} />`,
  ]
  if (sqlite) {
    lines.push(`import Push from './pages/Push'`)
    lines.push(`import List from './pages/List'`)
    routes.push(`<Route path="/push" element={<Push />} />`)
    routes.push(`<Route path="/list" element={<List />} />`)
  }
  return [
    ...lines,
    ``,
    `export default function App() {`,
    `  return (`,
    `    <div>`,
    `      <nav>`,
    `        <Link to="/">Home</Link>`,
    sqlite ? `        <Link to="/push">Push</Link>\n        <Link to="/list">List</Link>` : '',
    `      </nav>`,
    `      <Routes>`,
    `        ${routes.join('\n        ')}`,
    `      </Routes>`,
    `    </div>`,
    `  )`,
    `}`,
  ].join('\n')
}

function generateVueRouter(sqlite: boolean): string {
  const lines: string[] = [
    `import { createRouter, createWebHistory } from 'vue-router'`,
    `import Home from '../pages/Home.vue'`,
  ]
  const routes: string[] = [
    `{ path: '/', component: Home },`,
  ]
  if (sqlite) {
    lines.push(`import Push from '../pages/Push.vue'`)
    lines.push(`import List from '../pages/List.vue'`)
    routes.push(`{ path: '/push', component: Push },`)
    routes.push(`{ path: '/list', component: List },`)
  }
  return [
    ...lines,
    ``,
    `const routes = [`,
    `  ${routes.join('\n  ')}`,
    `]`,
    ``,
    `export default createRouter({`,
    `  history: createWebHistory(),`,
    `  routes,`,
    `})`,
  ].join('\n')
}
