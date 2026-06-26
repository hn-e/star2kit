#!/usr/bin/env node

import { select, input, confirm, password } from '@inquirer/prompts'
import AdmZip from 'adm-zip'

const SERVER_URL = process.env.KITINIT_URL || 'http://localhost:3000'

interface ManifestOption {
  id: string
  name: string
  available: boolean
}

interface Manifest {
  frontends: ManifestOption[]
  backends: ManifestOption[]
  databases: ManifestOption[]
  storages: ManifestOption[]
  auths: ManifestOption[]
}

interface CredentialField {
  key: string
  label: string
  secret?: boolean
  default?: string
}

const STORAGE_CREDENTIALS: Record<string, CredentialField[]> = {
  s3: [
    { key: 's3Endpoint', label: 'S3 Endpoint URL' },
    { key: 's3AccessKey', label: 'S3 Access Key ID' },
    { key: 's3SecretKey', label: 'S3 Secret Access Key', secret: true },
    { key: 's3BucketName', label: 'S3 Bucket Name', default: 'my-bucket' },
    { key: 's3Region', label: 'S3 Region', default: 'us-east-1' },
  ],
  r2: [
    { key: 'r2Endpoint', label: 'R2 Endpoint URL' },
    { key: 'r2AccessKey', label: 'R2 Access Key ID' },
    { key: 'r2SecretKey', label: 'R2 Secret Access Key', secret: true },
    { key: 'r2BucketName', label: 'R2 Bucket Name', default: 'my-bucket' },
  ],
}

const AUTH_CREDENTIALS: Record<string, CredentialField[]> = {
  clerk: [
    { key: 'clerkPublishableKey', label: 'Clerk Publishable Key', secret: true },
  ],
  auth0: [
    { key: 'auth0Domain', label: 'Auth0 Domain' },
    { key: 'auth0ClientId', label: 'Auth0 Client ID', secret: true },
  ],
}

async function fetchManifest(): Promise<Manifest> {
  const res = await fetch(`${SERVER_URL}/api/manifest`, {
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`Server returned ${res.status} ${res.statusText}`)
  return res.json()
}

async function pickOption(message: string, options: ManifestOption[]): Promise<string> {
  if (options.length === 0) throw new Error(`No available options for "${message}"`)

  const choice = options.find(o => o.id === 'none')
  const hasNoneOption = !!choice && choice.available

  if (options.length === 1 && !hasNoneOption) {
    return options[0].id
  }

  if (options.length === 1 && hasNoneOption) {
    return 'none'
  }

  return select({
    message,
    choices: options.map(o => ({
      name: o.name,
      value: o.id,
    })),
  })
}

async function promptCredentialFields(fields: CredentialField[]): Promise<Record<string, string>> {
  const result: Record<string, string> = {}
  for (const field of fields) {
    if (field.secret) {
      result[field.key] = await password({ message: `${field.label}:`, mask: true })
    } else {
      result[field.key] = await input({ message: `${field.label}:` })
    }
  }
  return result
}

async function main() {
  const projectDir = process.argv[2] || 'my-project'

  console.log('')
  console.log('  Kit Init — project scaffolding wizard')
  console.log('  ─────────────────────────────────────')
  console.log('')

  const manifest = await fetchManifest()

  const frontend = await pickOption('Select a frontend framework:',
    manifest.frontends.filter(f => f.available))
  const backend = await pickOption('Select a backend framework:',
    manifest.backends.filter(b => b.available))
  const dbChoice = await pickOption('Select a database:',
    manifest.databases.filter(d => d.available))

  const sqlite = dbChoice === 'sqlite'

  const storageOptions = manifest.storages.filter(s => s.available)
  let storage: string | null = null
  const storageCredentials: Record<string, string> = {}
  if (storageOptions.length > 1) {
    storage = await pickOption('Select storage:', storageOptions)
    if (storage && storage !== 'none') {
      const fields = STORAGE_CREDENTIALS[storage]
      if (fields) {
        console.log(`  Enter ${storage.toUpperCase()} credentials:`)
        Object.assign(storageCredentials, await promptCredentialFields(fields))
      }
    }
  }

  const authOptions = manifest.auths.filter(a => a.available)
  let auth: string | null = null
  const authCredentials: Record<string, string> = {}
  if (authOptions.length > 1) {
    auth = await pickOption('Select auth provider:', authOptions)
    if (auth && auth !== 'none') {
      const fields = AUTH_CREDENTIALS[auth]
      if (fields) {
        console.log(`  Enter ${auth.charAt(0).toUpperCase() + auth.slice(1)} credentials:`)
        Object.assign(authCredentials, await promptCredentialFields(fields))
      }
    }
  }

  const body: Record<string, unknown> = {
    frontend,
    backend,
    sqlite,
    storage: storage === 'none' ? null : storage,
    auth: auth === 'none' ? null : auth,
    ...storageCredentials,
    ...authCredentials,
  }

  console.log('')
  console.log('  Generating project...')

  const res = await fetch(`${SERVER_URL}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30000),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Server returned ${res.status}: ${text || res.statusText}`)
  }

  const buffer = Buffer.from(await res.arrayBuffer())
  const zip = new AdmZip(buffer)
  zip.extractAllTo(`./${projectDir}`, true)

  console.log(`  Project created at ./${projectDir}`)
  console.log('')
  console.log('  cd', projectDir)
  console.log('')
}

main().catch(err => {
  console.error(`  Error: ${err.message}`)
  process.exit(1)
})
