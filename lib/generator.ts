import JSZip from 'jszip'
import path from 'path'
import fs from 'fs'
import type { ProjectOptions } from './types'

const TEMPLATES = path.join(process.cwd(), 'lib', 'templates')

export async function generateProject(options: ProjectOptions): Promise<Buffer> {
  const zip = new JSZip()
  const { frontend, backend, sqlite, storage } = options
  const hasStorage = storage !== null

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

  // 2. Server static files (tsconfig, etc.)
  addDir(`${backend}/server`, 'server')

  // 3. Frontend
  addDir(`${frontend}/client`, 'client')

  // 4. SQLite
  if (sqlite) {
    addDir(`sqlite/${backend}/server`, 'server')
    addDir(`sqlite/${frontend}/client/src/pages`, 'client/src/pages')
  }

  // 5. Storage (R2 / S3)
  if (hasStorage) {
    addDir(`storage/${storage}/${backend}/server`, 'server')
    addDir(`storage/${storage}/${frontend}/client/src/pages`, 'client/src/pages')
  }

  // 6. Dynamic files
  zip.file('server/package.json', generateServerPkg(hasStorage))
  if (backend === 'express') {
    zip.file('server/src/index.ts', generateExpressIndex(sqlite, hasStorage))
  } else {
    zip.file('server/requirements.txt', generateFlaskReqs(hasStorage))
    zip.file('server/app.py', generateFlaskApp(sqlite, hasStorage))
  }

  if (frontend === 'react') {
    zip.file('client/src/App.tsx', generateReactApp(sqlite, hasStorage))
  } else {
    zip.file('client/src/router/index.ts', generateVueRouter(sqlite, hasStorage))
  }

  // 7. .env files
  const envContent = generateEnv(options)
  zip.file('server/.env', envContent)
  zip.file('client/.env', envContent)

  return zip.generateAsync({ type: 'nodebuffer' })
}

function generateServerPkg(storage: boolean): string {
  const deps: Record<string, string> = { express: '^4.21.0', cors: '^2.8.5' }
  const devDeps: Record<string, string> = {
    '@types/express': '^5.0.0',
    '@types/cors': '^2.8.17',
    tsx: '^4.19.0',
    typescript: '^5.0.0',
  }
  if (storage) {
    deps['@aws-sdk/client-s3'] = '^3.0.0'
    deps['multer'] = '^2.0.0'
    devDeps['@types/multer'] = '^1.4.0'
  }
  deps['dotenv'] = '^16.0.0'
  devDeps['@types/dotenv'] = '^8.2.0'
  return JSON.stringify({
    name: 'server', private: true, type: 'module',
    scripts: { dev: 'tsx watch src/index.ts' },
    dependencies: deps, devDependencies: devDeps,
  }, null, 2)
}

function generateFlaskReqs(storage: boolean): string {
  const reqs = ['flask==3.1.0', 'flask-cors==5.0.1', 'python-dotenv==1.1.0']
  if (storage) reqs.push('boto3')
  return reqs.join('\n') + '\n'
}

function generateExpressIndex(sqlite: boolean, storage: boolean): string {
  const lines: string[] = [
    `import 'dotenv/config'`,
    `import express from 'express'`,
    `import cors from 'cors'`,
  ]
  if (sqlite) {
    lines.push(`import { initDB } from './db'`)
    lines.push(`import pushRouter from './routes/push'`)
    lines.push(`import listRouter from './routes/list'`)
  }
  if (storage) {
    lines.push(`import uploadRouter from './routes/upload'`)
    lines.push(`import filesRouter from './routes/files'`)
  }
  lines.push(``, `const app = express()`, `app.use(cors())`, `app.use(express.json())`)
  if (sqlite) { lines.push(`initDB()`) }
  if (storage) { lines.push(`app.use(express.urlencoded({ extended: true }))`) }
  if (sqlite) { lines.push(`app.use('/api/push', pushRouter)`, `app.use('/api/list', listRouter)`) }
  if (storage) { lines.push(`app.use('/api/upload', uploadRouter)`, `app.use('/api/files', filesRouter)`) }
  lines.push(`app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))`)
  lines.push(`app.listen(3001, () => console.log('Server running on http://localhost:3001'))`)
  return lines.join('\n')
}

function generateFlaskApp(sqlite: boolean, storage: boolean): string {
  const lines: string[] = [
    `from flask import Flask`,
    `from flask_cors import CORS`,
  ]
  if (sqlite) { lines.push(`import db`, `from routes.push import push_bp`, `from routes.list import list_bp`) }
  if (storage) { lines.push(`from routes.upload import upload_bp`, `from routes.files import files_bp`) }
  lines.push(``, `app = Flask(__name__)`, `CORS(app)`)
  if (sqlite) { lines.push(`db.init_db()`, `app.register_blueprint(push_bp)`, `app.register_blueprint(list_bp)`) }
  if (storage) { lines.push(`app.register_blueprint(upload_bp)`, `app.register_blueprint(files_bp)`) }
  lines.push(`@app.route('/api/health')`, `def health():`, `    return {'status': 'ok'}`, ``)
  lines.push(`if __name__ == '__main__':`, `    app.run(port=3001, debug=True)`)
  return lines.join('\n')
}

function generateReactApp(sqlite: boolean, storage: boolean): string {
  const lines: string[] = [
    `import { Routes, Route, Link } from 'react-router-dom'`,
    `import Home from './pages/Home'`,
  ]
  const routes: string[] = [`<Route path="/" element={<Home />} />`]
  const nav: string[] = [`<Link to="/">Home</Link>`]
  if (sqlite) {
    lines.push(`import Push from './pages/Push'`, `import List from './pages/List'`)
    routes.push(`<Route path="/push" element={<Push />} />`, `<Route path="/list" element={<List />} />`)
    nav.push(`<Link to="/push">Push</Link>`, `<Link to="/list">List</Link>`)
  }
  if (storage) {
    lines.push(`import Upload from './pages/Upload'`, `import Files from './pages/Files'`)
    routes.push(`<Route path="/upload" element={<Upload />} />`, `<Route path="/files" element={<Files />} />`)
    nav.push(`<Link to="/upload">Upload</Link>`, `<Link to="/files">Files</Link>`)
  }
  return [
    ...lines, ``,
    `export default function App() {`,
    `  return (`,
    `    <div>`,
    `      <nav>`,
    ...nav.map(l => `        ${l}`),
    `      </nav>`,
    `      <Routes>`,
    ...routes.map(l => `        ${l}`),
    `      </Routes>`,
    `    </div>`,
    `  )`,
    `}`,
  ].join('\n')
}

function generateVueRouter(sqlite: boolean, storage: boolean): string {
  const lines: string[] = [
    `import { createRouter, createWebHistory } from 'vue-router'`,
    `import Home from '../pages/Home.vue'`,
  ]
  const routes: string[] = [`{ path: '/', component: Home },`]
  if (sqlite) {
    lines.push(`import Push from '../pages/Push.vue'`, `import List from '../pages/List.vue'`)
    routes.push(`{ path: '/push', component: Push },`, `{ path: '/list', component: List },`)
  }
  if (storage) {
    lines.push(`import Upload from '../pages/Upload.vue'`, `import Files from '../pages/Files.vue'`)
    routes.push(`{ path: '/upload', component: Upload },`, `{ path: '/files', component: Files },`)
  }
  return [
    ...lines, ``,
    `const routes = [`,
    ...routes.map(l => `  ${l}`),
    `]`, ``,
    `export default createRouter({`,
    `  history: createWebHistory(),`,
    `  routes,`,
    `})`,
  ].join('\n')
}

function generateEnv(options: ProjectOptions): string {
  const lines: string[] = []
  if (options.storage === 'r2') {
    lines.push(`# R2 Storage`, `R2_ENDPOINT=${options.r2Endpoint || ''}`, `R2_ACCESS_KEY=${options.r2AccessKey || ''}`, `R2_SECRET_KEY=${options.r2SecretKey || ''}`, `R2_BUCKET_NAME=${options.r2BucketName || ''}`, `R2_PUBLIC_URL=${options.r2PublicUrl || ''}`)
  }
  if (options.storage === 's3') {
    lines.push(`# S3 Storage`, `S3_ENDPOINT=${options.s3Endpoint || ''}`, `S3_ACCESS_KEY=${options.s3AccessKey || ''}`, `S3_SECRET_KEY=${options.s3SecretKey || ''}`, `S3_BUCKET_NAME=${options.s3BucketName || ''}`, `S3_REGION=${options.s3Region || ''}`, `S3_PUBLIC_URL=${options.s3PublicUrl || ''}`)
  }
  return lines.join('\n') + '\n'
}
