'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { SiJavascript, SiJquery, SiReact, SiVuedotjs, SiSvelte, SiSolid, SiFlask, SiExpress, SiFastapi, SiNextdotjs, SiDjango, SiSqlite, SiSupabase, SiPostgresql, SiAppwrite, SiMysql, SiMongodb, SiTailwindcss, SiBootstrap, SiBulma, SiClerk, SiMailgun, SiMailtrap, SiSendgrid, SiMailchimp, SiStripe, SiRazorpay, SiPaypal } from 'react-icons/si'
import GenerateOverlay from '@/lib/generate-overlay'
import { FaAws, FaCloudflare } from 'react-icons/fa'

const BRAND: Record<string, { hex: string; name: string }> = {
  vanilla: { hex: '#F7DF1E', name: 'JavaScript' },
  jquery: { hex: '#0769AD', name: 'jQuery' },
  react: { hex: '#61DAFB', name: 'React' },
  vue: { hex: '#42B883', name: 'Vue' },
  svelte: { hex: '#FF3E00', name: 'Svelte' },
  solid: { hex: '#2C4F7C', name: 'Solid' },
  flask: { hex: '#000000', name: 'Flask' },
  express: { hex: '#64748B', name: 'Express' },
  local: { hex: '#64748B', name: 'Local' },
  r2: { hex: '#0051FF', name: 'Cloudflare R2' },
  s3: { hex: '#FF9900', name: 'AWS S3' },
  fastapi: { hex: '#009688', name: 'FastAPI' },
  nextjs: { hex: '#000000', name: 'Next.js' },
  django: { hex: '#092E20', name: 'Django' },
  sqlite: { hex: '#003B57', name: 'SQLite' },
  postgres: { hex: '#336791', name: 'PostgreSQL' },
  supabase: { hex: '#3ECF8E', name: 'Supabase' },
  appwrite: { hex: '#FD366E', name: 'Appwrite' },
  mysql: { hex: '#4479A1', name: 'MySQL' },
  mongodb: { hex: '#47A248', name: 'MongoDB' },
  tailwind: { hex: '#06B6D4', name: 'Tailwind CSS' },
  bootstrap: { hex: '#7952B3', name: 'Bootstrap' },
  bulma: { hex: '#00D1B2', name: 'Bulma' },
  basic: { hex: '#64748B', name: 'Basic CSS' },
  clerk: { hex: '#6C47FF', name: 'Clerk' },
  auth0: { hex: '#EB5424', name: 'Auth0' },
  stripe: { hex: '#635BFF', name: 'Stripe' },
  razorpay: { hex: '#3399FF', name: 'Razorpay' },
  cashfree: { hex: '#1890FF', name: 'Cashfree' },
  paypal: { hex: '#003087', name: 'PayPal' },
  mailgun: { hex: '#F06B66', name: 'Mailgun' },
  mailtrap: { hex: '#22D172', name: 'Mailtrap' },
  sendgrid: { hex: '#1F82E2', name: 'SendGrid' },
  mailchimp: { hex: '#FFE01B', name: 'Mailchimp' },
  none: { hex: '#94a3b8', name: 'None' },
}

const STEPS = [
  { id: 'frontend', title: 'Frontend' },
  { id: 'backend', title: 'Backend' },
  { id: 'database', title: 'Database' },
  { id: 'storage', title: 'Storage' },
  { id: 'auth', title: 'Auth' },
  { id: 'mail', title: 'Mail' },
  { id: 'payments', title: 'Payments' },
  { id: 'style', title: 'Style' },
]

const LOGOS: Record<string, React.ReactNode> = {
  vanilla: <SiJavascript className="w-7 h-7" />,
  jquery: <SiJquery className="w-7 h-7" />,
  react: <SiReact className="w-7 h-7" />,
  vue: <SiVuedotjs className="w-7 h-7" />,
  svelte: <SiSvelte className="w-7 h-7" />,
  solid: <SiSolid className="w-7 h-7" />,
  flask: <SiFlask className="w-7 h-7" />,
  express: <SiExpress className="w-7 h-7" />,
  local: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>,
  r2: <FaCloudflare className="w-6 h-6" />,
  s3: <FaAws className="w-6 h-6" />,
  fastapi: <SiFastapi className="w-7 h-7" />,
  nextjs: <SiNextdotjs className="w-7 h-7" />,
  django: <SiDjango className="w-7 h-7" />,
  sqlite: <SiSqlite className="w-7 h-7" />,
  supabase: <SiSupabase className="w-7 h-7" />,
  appwrite: <SiAppwrite className="w-7 h-7" />,
  mysql: <SiMysql className="w-7 h-7" />,
  mongodb: <SiMongodb className="w-7 h-7" />,
  tailwind: <SiTailwindcss className="w-7 h-7" />,
  bootstrap: <SiBootstrap className="w-7 h-7" />,
  bulma: <SiBulma className="w-7 h-7" />,
  basic: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
  clerk: <SiClerk className="w-6 h-6" />,
  auth0: <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v6c0 5.25 3.83 10.25 9 11.5 5.17-1.25 9-6.25 9-11.5V7l-9-5z"/></svg>,
  postgres: <SiPostgresql className="w-7 h-7" />,
  mailgun: <SiMailgun className="w-7 h-7" />,
  mailtrap: <SiMailtrap className="w-7 h-7" />,
  sendgrid: <SiSendgrid className="w-7 h-7" />,
  mailchimp: <SiMailchimp className="w-7 h-7" />,
  stripe: <SiStripe className="w-7 h-7" />,
  razorpay: <SiRazorpay className="w-7 h-7" />,
  cashfree: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
  paypal: <SiPaypal className="w-7 h-7" />,
  none: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
}

interface ManifestItem {
  id: string
  name: string
  available: boolean
}

interface Manifest {
  frontends: ManifestItem[]
  backends: ManifestItem[]
  databases: ManifestItem[]
  storages: ManifestItem[]
  mails: ManifestItem[]
  payments: ManifestItem[]
  auths: ManifestItem[]
  styles: ManifestItem[]
}

function StepIndicator({ steps, current }: { steps: typeof STEPS; current: number }) {
  const stepDots = []
  for (let i = 0; i < steps.length; i++) {
    const done = current > i
    const active = current === i
    const dotClass = active || done ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
    const textClass = active || done ? 'text-black' : 'text-gray-400'
    const lineClass = done ? 'bg-black' : 'bg-gray-200'
    stepDots.push(
      <div key={steps[i].id} className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ' + dotClass}>
            {done ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          <span className={'text-xs font-medium mt-1.5 transition-colors duration-300 ' + textClass}>{steps[i].title}</span>
        </div>
        {steps.length - 1 > i && (
          <div className={'w-16 sm:w-24 h-0.5 mx-2 ' + lineClass}></div>
        )}
      </div>
    )
  }
  return <div className="flex items-center justify-center gap-0">{stepDots}</div>
}

function OptionCard({ id, name, selected, onSelect, logo, available }: { id: string; name: string; selected: boolean; onSelect: (id: string | null) => void; logo: React.ReactNode; available: boolean }) {
  return (
    <button
      onClick={() => onSelect(selected ? null : id)}
      className={`
        group relative w-full flex items-center gap-4 p-5 h-20 rounded-xl border text-left
        transition-all duration-200
        ${selected
          ? 'border-black bg-white'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg hover:shadow-gray-100'
        }
      `}
    >
      <div className={`
        shrink-0 w-11 h-11 rounded-lg flex items-center justify-center transition-colors duration-200
        ${selected ? 'bg-black text-white' : 'bg-gray-50 text-gray-500 group-hover:bg-gray-100'}
      `}>
        <span key={name || '_'} style={{ animation: name ? 'fadeIcon 0.3s ease-out' : 'none' }}>{logo}</span>
      </div>
      <div className={`font-semibold text-base truncate ${selected ? 'text-gray-900' : 'text-gray-900'}`} title={name}>
        {name}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className={`
          shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200
          ${selected ? (available ? 'border-black bg-black' : 'border-gray-400 bg-gray-400') : 'border-gray-300'}
        `}>
          {selected && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}

function SlotPreview({ selected, brand, logo, name }: { selected: boolean; brand?: string; logo?: React.ReactNode; name?: string | null }) {
  if (selected) {
    return (
      <div className="flex flex-col items-center gap-2 w-24">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md transition-all duration-300 shrink-0"
          style={{ background: brand }}
        >
          <span key={name} style={{ animation: 'popIn 0.2s ease-out' }}>{logo}</span>
        </div>
        <span className="text-xs font-semibold text-gray-700 text-center truncate w-full" title={name || ''}>{name}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 w-24">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-dashed border-gray-300 text-gray-300 text-xl font-semibold">
        ?
      </div>
      <span className="text-xs text-gray-400 font-medium text-center truncate w-full">Not selected</span>
    </div>
  )
}

function ExpandSlot({ show, children, extraStyle }: { show: boolean; children: React.ReactNode; extraStyle?: React.CSSProperties }) {
  return (
    <div style={{
      maxHeight: show ? 160 : 0,
      opacity: show ? 1 : 0,
      overflow: 'hidden',
      transition: 'all 0.45s ease',
      ...extraStyle,
    }}>
      {children}
    </div>
  )
}

function ExpandRow({ show, children }: { show: boolean; children: React.ReactNode }) {
  return (
    <div style={{
      maxWidth: show ? 200 : 0,
      opacity: show ? 1 : 0,
      overflow: 'hidden',
      transition: 'all 0.45s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexShrink: 0,
    }}>
      {children}
    </div>
  )
}

function LivePreview({
  frontend, backend, auth, mail, payments, style, database, storage, docker, setDocker,
  step, downloading, handleDownload, handleReset, manifest,
  generating, onGenerateReady, treeData,
  supabaseUrl, setSupabaseUrl, supabaseKey, setSupabaseKey,
  databaseUrl, setDatabaseUrl,
  appwriteEndpoint, setAppwriteEndpoint, appwriteProjectId, setAppwriteProjectId, appwriteApiKey, setAppwriteApiKey,
  r2Endpoint, setR2Endpoint, r2AccessKey, setR2AccessKey, r2SecretKey, setR2SecretKey, r2BucketName, setR2BucketName, r2PublicUrl, setR2PublicUrl,
  s3Endpoint, setS3Endpoint, s3AccessKey, setS3AccessKey, s3SecretKey, setS3SecretKey, s3BucketName, setS3BucketName, s3Region, setS3Region, s3PublicUrl, setS3PublicUrl,
  supabaseStorageUrl, setSupabaseStorageUrl, supabaseStorageKey, setSupabaseStorageKey,
  clerkPublishableKey, setClerkPublishableKey, clerkSecretKey, setClerkSecretKey,
  auth0Domain, setAuth0Domain, auth0ClientId, setAuth0ClientId,
  mailgunApiKey, setMailgunApiKey, mailgunDomain, setMailgunDomain, mailtrapApiToken, setMailtrapApiToken,
  sendgridApiKey, setSendgridApiKey, mailchimpApiKey, setMailchimpApiKey, mailchimpServerPrefix, setMailchimpServerPrefix,
  stripePublishableKey, setStripePublishableKey, stripeSecretKey, setStripeSecretKey,
  razorpayKeyId, setRazorpayKeyId, razorpayKeySecret, setRazorpayKeySecret,
  cashfreeAppId, setCashfreeAppId, cashfreeSecretKey, setCashfreeSecretKey,
  paypalClientId, setPaypalClientId, paypalClientSecret, setPaypalClientSecret,
  mongodbUri, setMongodbUri,
  mysqlUrl, setMysqlUrl, dbHost, setDbHost, dbPort, setDbPort, dbUser, setDbUser, dbPassword, setDbPassword, dbName, setDbName,
}: {
  frontend: string | null; backend: string | null; auth: string | null; mail: string | null; payments: string | null; style: string | null; database: string | null; storage: string | null
  docker: boolean; setDocker: (v: boolean) => void
  step: number; downloading: boolean; handleDownload: () => void; handleReset: () => void; manifest: Manifest | null
  generating: boolean; onGenerateReady: () => void; treeData: unknown
  supabaseUrl: string; setSupabaseUrl: (v: string) => void; supabaseKey: string; setSupabaseKey: (v: string) => void
  databaseUrl: string; setDatabaseUrl: (v: string) => void
  appwriteEndpoint: string; setAppwriteEndpoint: (v: string) => void; appwriteProjectId: string; setAppwriteProjectId: (v: string) => void; appwriteApiKey: string; setAppwriteApiKey: (v: string) => void
  r2Endpoint: string; setR2Endpoint: (v: string) => void; r2AccessKey: string; setR2AccessKey: (v: string) => void; r2SecretKey: string; setR2SecretKey: (v: string) => void; r2BucketName: string; setR2BucketName: (v: string) => void; r2PublicUrl: string; setR2PublicUrl: (v: string) => void
  s3Endpoint: string; setS3Endpoint: (v: string) => void; s3AccessKey: string; setS3AccessKey: (v: string) => void; s3SecretKey: string; setS3SecretKey: (v: string) => void; s3BucketName: string; setS3BucketName: (v: string) => void; s3Region: string; setS3Region: (v: string) => void; s3PublicUrl: string; setS3PublicUrl: (v: string) => void
  supabaseStorageUrl: string; setSupabaseStorageUrl: (v: string) => void; supabaseStorageKey: string; setSupabaseStorageKey: (v: string) => void
  clerkPublishableKey: string; setClerkPublishableKey: (v: string) => void; clerkSecretKey: string; setClerkSecretKey: (v: string) => void; auth0Domain: string; setAuth0Domain: (v: string) => void; auth0ClientId: string; setAuth0ClientId: (v: string) => void; mailgunApiKey: string; setMailgunApiKey: (v: string) => void; mailgunDomain: string; setMailgunDomain: (v: string) => void; mailtrapApiToken: string; setMailtrapApiToken: (v: string) => void; sendgridApiKey: string; setSendgridApiKey: (v: string) => void; mailchimpApiKey: string; setMailchimpApiKey: (v: string) => void; mailchimpServerPrefix: string; setMailchimpServerPrefix: (v: string) => void; stripePublishableKey: string; setStripePublishableKey: (v: string) => void; stripeSecretKey: string; setStripeSecretKey: (v: string) => void; razorpayKeyId: string; setRazorpayKeyId: (v: string) => void; razorpayKeySecret: string; setRazorpayKeySecret: (v: string) => void; cashfreeAppId: string; setCashfreeAppId: (v: string) => void; cashfreeSecretKey: string; setCashfreeSecretKey: (v: string) => void; paypalClientId: string; setPaypalClientId: (v: string) => void; paypalClientSecret: string; setPaypalClientSecret: (v: string) => void
  mongodbUri: string; setMongodbUri: (v: string) => void
  mysqlUrl: string; setMysqlUrl: (v: string) => void; dbHost: string; setDbHost: (v: string) => void; dbPort: string; setDbPort: (v: string) => void; dbUser: string; setDbUser: (v: string) => void; dbPassword: string; setDbPassword: (v: string) => void; dbName: string; setDbName: (v: string) => void
}) {
  const frontName = frontend ? manifest?.frontends.find(f => f.id === frontend)?.name : null
  const backName = backend ? manifest?.backends.find(b => b.id === backend)?.name : null
  const styleName = style ? manifest?.styles.find(s => s.id === style)?.name : null
  const dbName_ = database ? database.charAt(0).toUpperCase() + database.slice(1) : null
  const storageName = storage ? manifest?.storages.find(s => s.id === storage)?.name : null
  const authName = auth ? manifest?.auths.find(a => a.id === auth)?.name : null
  const mailName = mail ? manifest?.mails.find(m => m.id === mail)?.name : null
  const paymentsName = payments ? manifest?.payments.find(p => p.id === payments)?.name : null
  const showOverlay = (step === 2 && (database === 'supabase' || database === 'appwrite' || database === 'postgres')) ||
    (step === 3 && (storage === 'r2' || storage === 's3' || storage === 'supabase')) ||
    (step === 4 && (auth === 'clerk' || auth === 'auth0')) ||
    (step === 5 && (mail === 'mailgun' || mail === 'mailtrap' || mail === 'sendgrid' || mail === 'mailchimp')) ||
    (step === 6 && (payments === 'stripe' || payments === 'razorpay' || payments === 'cashfree' || payments === 'paypal'))

  const inputStyle = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors bg-white'
  const labelStyle = 'block text-xs font-medium text-gray-500 mb-1'
  const [overlayOpen, setOverlayOpen] = useState(true)
  const [overlayClosing, setOverlayClosing] = useState(false)
  const [overlayVisible, setOverlayVisible] = useState(false)
  useEffect(() => {
    setOverlayOpen(true)
    setOverlayClosing(false)
    setOverlayVisible(false)
    const t = setTimeout(() => setOverlayVisible(true), 500)
    return () => clearTimeout(t)
  }, [database, storage, auth, mail, payments])
  const closeOverlay = () => {
    setOverlayClosing(true)
    setTimeout(() => { setOverlayOpen(false); setOverlayClosing(false) }, 300)
  }

  return (
    <div className="bg-white rounded-2xl lg:sticky lg:top-8 h-[80vh] flex flex-col relative overflow-hidden" style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
      {generating ? (
        <GenerateOverlay open onReady={onGenerateReady} tree={treeData as any} />
      ) : (
      <div className="flex flex-col flex-1 p-6"><h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-center mb-6">
        Your Stack
      </h3>

      <div className="flex flex-col items-center gap-0 flex-1 justify-center">
        <div className="grid items-center justify-items-center" style={{
          gridTemplateColumns: '1fr auto auto auto auto 1fr',
          gridTemplateRows: 'auto 12px auto 12px auto',
          gap: '24px 12px',
        }}>
          <ExpandSlot show={!!frontend && frontend !== 'none'} extraStyle={{ gridColumn: 3, gridRow: 1 }}>
            <SlotPreview selected brand={BRAND[frontend || '']?.hex} logo={LOGOS[frontend || '']} name={frontName} />
          </ExpandSlot>

          <div style={{ gridColumn: 4, gridRow: 1 }}>
            <ExpandRow show={!!style && style !== 'none'}>
              <div className="w-8 h-px bg-gray-300" style={{ marginTop: '-10px' }} />
              <SlotPreview selected brand={BRAND[style || '']?.hex} logo={LOGOS[style || '']} name={styleName} />
            </ExpandRow>
          </div>

          <ExpandSlot show={!!frontend && frontend !== 'none' && !!backend && backend !== 'none'} extraStyle={{ gridColumn: 3, gridRow: 2 }}>
            <div className="w-px h-6 bg-gray-300" />
          </ExpandSlot>

          <ExpandSlot show={!!backend && backend !== 'none'} extraStyle={{ gridColumn: 3, gridRow: 3 }}>
            <SlotPreview selected brand={BRAND[backend || '']?.hex} logo={LOGOS[backend || '']} name={backName} />
          </ExpandSlot>

          <div style={{ gridColumn: 4, gridRow: 3 }}>
            <ExpandRow show={!!auth && auth !== 'none'}>
              <div className="w-8 h-px bg-gray-300" style={{ marginTop: '-10px' }} />
              <SlotPreview selected brand={BRAND[auth || '']?.hex} logo={LOGOS[auth || '']} name={authName} />
            </ExpandRow>
          </div>

          <div style={{ gridColumn: 5, gridRow: 3 }}>
            <ExpandRow show={!!mail && mail !== 'none'}>
              <div className="w-8 h-px bg-gray-300" style={{ marginTop: '-10px' }} />
              <SlotPreview selected brand={BRAND[mail || '']?.hex} logo={LOGOS[mail || '']} name={mailName} />
            </ExpandRow>
          </div>

          <ExpandSlot show={!!backend && backend !== 'none' && !!database && database !== 'none'} extraStyle={{ gridColumn: 3, gridRow: 4 }}>
            <div className="w-px h-6 bg-gray-300" />
          </ExpandSlot>

          <div style={{ gridColumn: 2, gridRow: 3 }}>
            <ExpandRow show={!!payments && payments !== 'none'}>
              <SlotPreview selected brand={BRAND[payments || '']?.hex} logo={LOGOS[payments || '']} name={paymentsName} />
              <div className="w-8 h-px bg-gray-300" style={{ marginTop: '-10px' }} />
            </ExpandRow>
          </div>

          <div style={{ gridColumn: 2, gridRow: 5 }}>
            <ExpandRow show={!!storage && storage !== 'none'}>
              <SlotPreview selected brand={BRAND[storage || '']?.hex} logo={LOGOS[storage || '']} name={storageName} />
              <div className="w-8 h-px bg-gray-300" style={{ marginTop: '-10px' }} />
            </ExpandRow>
          </div>

          <ExpandSlot show={!!database && database !== 'none'} extraStyle={{ gridColumn: 3, gridRow: 5 }}>
            <SlotPreview selected brand={BRAND[database || '']?.hex} logo={LOGOS[database || '']} name={dbName_} />
          </ExpandSlot>
        </div>
      </div>

      <div className="mt-auto pt-6 min-h-25 flex flex-col items-center justify-end">
        {step === 7 && style !== null ? (
          <div className="flex flex-col items-center gap-3 w-full" style={{ animation: 'fadeSlideUp 0.4s ease-out' }}>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`
                inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                transition-all duration-200
                ${downloading
                  ? 'bg-gray-400 text-white cursor-wait'
                  : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
                }
              `}
            >
              {downloading ? (
                <>
                  <span className="inline-block w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Download ZIP
                </>
              )}
            </button>
            <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Start over
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-400 text-center">
            {!frontend && !backend && 'Select a frontend to begin'}
            {frontend && !backend && 'Now select a backend'}
            {frontend && backend && 'Ready to download'}
          </p>
        )}
      </div>

      {showOverlay && overlayVisible && (overlayOpen || overlayClosing) && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center p-6 z-10" style={{ animation: overlayClosing ? 'fadeOut 0.25s ease-in forwards' : 'fadeIn 0.2s ease-out' }}>
          <div className="w-full max-w-xs" style={{ marginTop: '-60px' }}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center mb-4">Configuration</p>

            {step === 2 && database === 'supabase' && (
              <div><label className={labelStyle}>Supabase URL</label><input type="text" value={supabaseUrl} onChange={e => setSupabaseUrl(e.target.value)} placeholder="https://your-project.supabase.co" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Anon Key</label><input type="text" value={supabaseKey} onChange={e => setSupabaseKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." className={inputStyle} /></div></div>
            )}
            {step === 2 && database === 'postgres' && (
              <div><label className={labelStyle}>DATABASE_URL</label><input type="text" value={databaseUrl} onChange={e => setDatabaseUrl(e.target.value)} placeholder="postgresql://user:pass@localhost:5432/mydb" className={inputStyle} /></div>
            )}
            {step === 2 && database === 'appwrite' && (
              <div><label className={labelStyle}>Endpoint</label><input type="text" value={appwriteEndpoint} onChange={e => setAppwriteEndpoint(e.target.value)} placeholder="https://cloud.appwrite.io/v1" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Project ID</label><input type="text" value={appwriteProjectId} onChange={e => setAppwriteProjectId(e.target.value)} placeholder="your-project-id" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>API Key</label><input type="text" value={appwriteApiKey} onChange={e => setAppwriteApiKey(e.target.value)} placeholder="standard_..." className={inputStyle} /></div></div>
            )}
            {step === 2 && database === 'mysql' && (
              <div><label className={labelStyle}>DATABASE_URL</label><input type="text" value={mysqlUrl} onChange={e => setMysqlUrl(e.target.value)} placeholder="mysql://user:pass@localhost:3306/mydb" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Host</label><input type="text" value={dbHost} onChange={e => setDbHost(e.target.value)} placeholder="localhost" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Port</label><input type="text" value={dbPort} onChange={e => setDbPort(e.target.value)} placeholder="3306" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>User</label><input type="text" value={dbUser} onChange={e => setDbUser(e.target.value)} placeholder="root" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Password</label><input type="text" value={dbPassword} onChange={e => setDbPassword(e.target.value)} placeholder="" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Database Name</label><input type="text" value={dbName} onChange={e => setDbName(e.target.value)} placeholder="starter" className={inputStyle} /></div></div>
            )}
            {step === 2 && database === 'mongodb' && (
              <div><label className={labelStyle}>MongoDB URI</label><input type="text" value={mongodbUri} onChange={e => setMongodbUri(e.target.value)} placeholder="mongodb://localhost:27017/mydb" className={inputStyle} /></div>
            )}
            {step === 3 && storage === 'r2' && (
              <div><label className={labelStyle}>Endpoint</label><input type="text" value={r2Endpoint} onChange={e => setR2Endpoint(e.target.value)} placeholder="https://..." className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Access Key</label><input type="text" value={r2AccessKey} onChange={e => setR2AccessKey(e.target.value)} placeholder="your-access-key" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Secret Key</label><input type="text" value={r2SecretKey} onChange={e => setR2SecretKey(e.target.value)} placeholder="your-secret-key" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Bucket Name</label><input type="text" value={r2BucketName} onChange={e => setR2BucketName(e.target.value)} placeholder="my-bucket" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Public URL</label><input type="text" value={r2PublicUrl} onChange={e => setR2PublicUrl(e.target.value)} placeholder="https://pub-xxxxx.r2.dev" className={inputStyle} /></div></div>
            )}
            {step === 3 && storage === 's3' && (
              <div><label className={labelStyle}>Endpoint</label><input type="text" value={s3Endpoint} onChange={e => setS3Endpoint(e.target.value)} placeholder="https://s3.amazonaws.com" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Access Key</label><input type="text" value={s3AccessKey} onChange={e => setS3AccessKey(e.target.value)} placeholder="your-access-key" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Secret Key</label><input type="text" value={s3SecretKey} onChange={e => setS3SecretKey(e.target.value)} placeholder="your-secret-key" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Bucket Name</label><input type="text" value={s3BucketName} onChange={e => setS3BucketName(e.target.value)} placeholder="my-bucket" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Region</label><input type="text" value={s3Region} onChange={e => setS3Region(e.target.value)} placeholder="us-east-1" className={inputStyle} /></div>
              <div className="mt-3"><label className={labelStyle}>Public URL</label><input type="text" value={s3PublicUrl} onChange={e => setS3PublicUrl(e.target.value)} placeholder="https://my-bucket.s3.amazonaws.com" className={inputStyle} /></div></div>
            )}
            {step === 3 && storage === 'supabase' && (
              <div><label className={labelStyle}>Supabase URL</label><input type="text" value={supabaseStorageUrl} onChange={e => setSupabaseStorageUrl(e.target.value)} placeholder="https://your-project.supabase.co" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Anon Key</label><input type="text" value={supabaseStorageKey} onChange={e => setSupabaseStorageKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." className={inputStyle} /></div></div>
            )}
            {step === 4 && auth === 'clerk' && (
              <div><label className={labelStyle}>Publishable Key</label><input type="text" value={clerkPublishableKey} onChange={e => setClerkPublishableKey(e.target.value)} placeholder="pk_test_..." className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Secret Key</label><input type="text" value={clerkSecretKey} onChange={e => setClerkSecretKey(e.target.value)} placeholder="sk_test_..." className={inputStyle} /></div></div>
            )}
            {step === 4 && auth === 'auth0' && (
              <div><label className={labelStyle}>Domain</label><input type="text" value={auth0Domain} onChange={e => setAuth0Domain(e.target.value)} placeholder="dev-xxx.us.auth0.com" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Client ID</label><input type="text" value={auth0ClientId} onChange={e => setAuth0ClientId(e.target.value)} placeholder="your-client-id" className={inputStyle} /></div></div>
            )}
            {step === 5 && mail === 'mailgun' && (
              <div><label className={labelStyle}>API Key</label><input type="text" value={mailgunApiKey} onChange={e => setMailgunApiKey(e.target.value)} placeholder="key-..." className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Domain</label><input type="text" value={mailgunDomain} onChange={e => setMailgunDomain(e.target.value)} placeholder="mg.yourdomain.com" className={inputStyle} /></div></div>
            )}
            {step === 5 && mail === 'mailtrap' && (
              <div><label className={labelStyle}>API Token</label><input type="text" value={mailtrapApiToken} onChange={e => setMailtrapApiToken(e.target.value)} placeholder="your-api-token" className={inputStyle} /></div>
            )}
            {step === 5 && mail === 'sendgrid' && (
              <div><label className={labelStyle}>API Key</label><input type="text" value={sendgridApiKey} onChange={e => setSendgridApiKey(e.target.value)} placeholder="SG.xxxxx" className={inputStyle} /></div>
            )}
            {step === 5 && mail === 'mailchimp' && (
              <div><label className={labelStyle}>API Key</label><input type="text" value={mailchimpApiKey} onChange={e => setMailchimpApiKey(e.target.value)} placeholder="your-api-key" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Server Prefix</label><input type="text" value={mailchimpServerPrefix} onChange={e => setMailchimpServerPrefix(e.target.value)} placeholder="us1" className={inputStyle} /></div></div>
            )}
            {step === 6 && payments === 'stripe' && (
              <div><label className={labelStyle}>Publishable Key</label><input type="text" value={stripePublishableKey} onChange={e => setStripePublishableKey(e.target.value)} placeholder="pk_test_..." className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Secret Key</label><input type="text" value={stripeSecretKey} onChange={e => setStripeSecretKey(e.target.value)} placeholder="sk_test_..." className={inputStyle} /></div></div>
            )}
            {step === 6 && payments === 'razorpay' && (
              <div><label className={labelStyle}>Key ID</label><input type="text" value={razorpayKeyId} onChange={e => setRazorpayKeyId(e.target.value)} placeholder="rzp_test_..." className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Key Secret</label><input type="text" value={razorpayKeySecret} onChange={e => setRazorpayKeySecret(e.target.value)} placeholder="your-key-secret" className={inputStyle} /></div></div>
            )}
            {step === 6 && payments === 'cashfree' && (
              <div><label className={labelStyle}>App ID</label><input type="text" value={cashfreeAppId} onChange={e => setCashfreeAppId(e.target.value)} placeholder="your-app-id" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Secret Key</label><input type="text" value={cashfreeSecretKey} onChange={e => setCashfreeSecretKey(e.target.value)} placeholder="your-secret-key" className={inputStyle} /></div></div>
            )}
            {step === 6 && payments === 'paypal' && (
              <div><label className={labelStyle}>Client ID</label><input type="text" value={paypalClientId} onChange={e => setPaypalClientId(e.target.value)} placeholder="your-client-id" className={inputStyle} />
              <div className="mt-3"><label className={labelStyle}>Client Secret</label><input type="text" value={paypalClientSecret} onChange={e => setPaypalClientSecret(e.target.value)} placeholder="your-client-secret" className={inputStyle} /></div></div>
            )}
            <div className="flex flex-col items-center gap-3 mt-4">
              <div className="w-[70%] relative">
                <button onClick={closeOverlay} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-black text-white hover:bg-gray-800 active:scale-[0.98]">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  Done
                </button>
                <div className="group absolute top-1/2 -translate-y-1/2" style={{ right: '-28px' }}>
                  <svg className="w-5 h-5 text-gray-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity w-50 text-center pointer-events-none shadow-lg">
                    Env vars are never passed to the generators- and are never stored.
                  </div>
                </div>
              </div>
              <button onClick={closeOverlay} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">I&apos;ll add manually</button>
            </div>
          </div>
        </div>
      )}
      </div>)}
    </div>
  )
}

function fadeIn(idx: number) {
  return {
    animation: `fadeIn 0.3s ease-out ${idx * 0.07}s both`,
  }
}

export default function Home() {
  const [step, setStep] = useState(0)
  const [frontend, setFrontend] = useState<string | null>(null)
  const [backend, setBackend] = useState<string | null>(null)
  const [docker, setDocker] = useState(false)
  const [storage, setStorage] = useState<string | null>(null)
  const [auth, setAuth] = useState<string | null>(null)
  const [mail, setMail] = useState<string | null>(null)
  const [payments, setPayments] = useState<string | null>(null)
  const [style, setStyle] = useState<string | null>(null)
  const [database, setDatabase] = useState<string | null>(null)
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseKey, setSupabaseKey] = useState('')
  const [databaseUrl, setDatabaseUrl] = useState('')
  const [appwriteEndpoint, setAppwriteEndpoint] = useState('')
  const [appwriteProjectId, setAppwriteProjectId] = useState('')
  const [appwriteApiKey, setAppwriteApiKey] = useState('')
  const [r2Endpoint, setR2Endpoint] = useState('')
  const [r2AccessKey, setR2AccessKey] = useState('')
  const [r2SecretKey, setR2SecretKey] = useState('')
  const [r2BucketName, setR2BucketName] = useState('')
  const [r2PublicUrl, setR2PublicUrl] = useState('')
  const [s3Endpoint, setS3Endpoint] = useState('')
  const [s3AccessKey, setS3AccessKey] = useState('')
  const [s3SecretKey, setS3SecretKey] = useState('')
  const [s3BucketName, setS3BucketName] = useState('')
  const [s3Region, setS3Region] = useState('')
  const [s3PublicUrl, setS3PublicUrl] = useState('')
  const [supabaseStorageUrl, setSupabaseStorageUrl] = useState('')
  const [supabaseStorageKey, setSupabaseStorageKey] = useState('')
  const [mongodbUri, setMongodbUri] = useState('')
  const [mysqlUrl, setMysqlUrl] = useState('')
  const [dbHost, setDbHost] = useState('')
  const [dbPort, setDbPort] = useState('')
  const [dbUser, setDbUser] = useState('')
  const [dbPassword, setDbPassword] = useState('')
  const [dbName, setDbName] = useState('')

  const [clerkPublishableKey, setClerkPublishableKey] = useState('')
  const [clerkSecretKey, setClerkSecretKey] = useState('')
  const [auth0Domain, setAuth0Domain] = useState('')
  const [auth0ClientId, setAuth0ClientId] = useState('')
  const [mailgunApiKey, setMailgunApiKey] = useState('')
  const [mailgunDomain, setMailgunDomain] = useState('')
  const [mailtrapApiToken, setMailtrapApiToken] = useState('')
  const [sendgridApiKey, setSendgridApiKey] = useState('')
  const [mailchimpApiKey, setMailchimpApiKey] = useState('')
  const [mailchimpServerPrefix, setMailchimpServerPrefix] = useState('')
  const [stripePublishableKey, setStripePublishableKey] = useState('')
  const [stripeSecretKey, setStripeSecretKey] = useState('')
  const [razorpayKeyId, setRazorpayKeyId] = useState('')
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('')
  const [cashfreeAppId, setCashfreeAppId] = useState('')
  const [cashfreeSecretKey, setCashfreeSecretKey] = useState('')
  const [paypalClientId, setPaypalClientId] = useState('')
  const [paypalClientSecret, setPaypalClientSecret] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  const [treeData, setTreeData] = useState<unknown>(null)
  const [manifest, setManifest] = useState<Manifest | null>(null)
  const downloadOptsRef = useRef<Record<string, unknown>>({})

  useEffect(() => {
    fetch('/api/manifest')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load')
        return r.json()
      })
      .then((data: Manifest) => {
        setManifest(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Could not connect to the server. Make sure it is running.')
        setLoading(false)
      })
  }, [])

  const canGoNext = () => {
    if (step === 0) return frontend !== null
    if (step === 1) return backend !== null
    if (step === 2) return database !== null
    if (step === 3) return storage !== null
    if (step === 4) return auth !== null
    if (step === 5) return mail !== null
    if (step === 6) return payments !== null
    return false
  }

  const handleNext = () => {
    if (step < 7) setStep(s => s + 1)
  }

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleReset = () => {
    setStep(0)
    setFrontend(null)
    setBackend(null)
    setDocker(false)
    setStorage(null)
    setAuth(null)
    setMail(null)
    setPayments(null)
    setStyle(null)
    setDatabase(null)
    setSupabaseUrl('')
    setSupabaseKey('')
    setDatabaseUrl('')
    setR2Endpoint('')
    setR2AccessKey('')
    setR2SecretKey('')
    setR2BucketName('')
    setR2PublicUrl('')
    setS3Endpoint('')
    setS3AccessKey('')
    setS3SecretKey('')
    setS3BucketName('')
    setS3Region('')
    setS3PublicUrl('')
    setSupabaseStorageUrl('')
    setSupabaseStorageKey('')
    setClerkPublishableKey('')
    setClerkSecretKey('')
    setAuth0Domain('')
    setAuth0ClientId('')
    setMailgunApiKey('')
    setMailgunDomain('')
    setMailtrapApiToken('')
    setSendgridApiKey('')
    setMailchimpApiKey('')
    setMailchimpServerPrefix('')
    setStripePublishableKey('')
    setStripeSecretKey('')
    setRazorpayKeyId('')
    setRazorpayKeySecret('')
    setCashfreeAppId('')
    setCashfreeSecretKey('')
    setPaypalClientId('')
    setPaypalClientSecret('')
    setMongodbUri('')
    setMysqlUrl('')
    setDbHost('')
    setDbPort('')
    setDbUser('')
    setDbPassword('')
    setDbName('')
  }

  const handleDownload = async () => {
    const opts = {
      frontend: ['react', 'vue'].includes(frontend || '') ? frontend : 'react',
      backend: ['express', 'flask'].includes(backend || '') ? backend : 'express',
      sqlite: database === 'sqlite',
      storage: (storage === 'r2' || storage === 's3') ? storage : null,
      auth: (auth === 'auth0' || auth === 'clerk') ? auth : null,
      auth0Domain: auth0Domain || undefined,
      auth0ClientId: auth0ClientId || undefined,
      clerkPublishableKey: clerkPublishableKey || undefined,
      mailgunApiKey: mailgunApiKey || undefined,
      mailgunDomain: mailgunDomain || undefined,
      mailtrapApiToken: mailtrapApiToken || undefined,
      sendgridApiKey: sendgridApiKey || undefined,
      mailchimpApiKey: mailchimpApiKey || undefined,
      mailchimpServerPrefix: mailchimpServerPrefix || undefined,
      r2Endpoint: r2Endpoint || undefined,
      r2AccessKey: r2AccessKey || undefined,
      r2SecretKey: r2SecretKey || undefined,
      r2BucketName: r2BucketName || undefined,
      r2PublicUrl: r2PublicUrl || undefined,
      s3Endpoint: s3Endpoint || undefined,
      s3AccessKey: s3AccessKey || undefined,
      s3SecretKey: s3SecretKey || undefined,
      s3BucketName: s3BucketName || undefined,
      s3Region: s3Region || undefined,
      s3PublicUrl: s3PublicUrl || undefined,
    }
    downloadOptsRef.current = opts
    try {
      const res = await fetch('/api/tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      })
      setTreeData(await res.json())
    } catch {
      setTreeData(null)
    }
    setShowOverlay(true)
  }

  const onOverlayReady = useCallback(async () => {
    setDownloading(true)
    const opts = downloadOptsRef.current as Record<string, unknown>
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(opts),
      })
      // return;
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'project.zip'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      alert('Failed to download. Please try again.')
    } finally {
      setDownloading(false)
      setShowOverlay(false)
    }
  }, [])

  // Safety timeout: if the overlay is open for 10s without onReady firing,
  // auto-trigger the download so the user is never stuck.
  useEffect(() => {
    if (!showOverlay) return
    const t = setTimeout(() => {
      onOverlayReady()
    }, 30000)
    return () => clearTimeout(t)
  }, [showOverlay]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-none mx-auto px-8 sm:px-12 lg:px-16 py-8 sm:py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 mt-8">
            <div className="w-8 h-8 border border-gray-200 border-t-black rounded-full animate-spin" />
            <p className="mt-4 text-sm text-gray-500">Loading...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-16 mt-8 text-center">
            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-xl mb-3">!</div>
            <p className="text-sm text-red-600 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-sm text-gray-600 hover:text-gray-800 underline">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <div className="flex flex-col lg:flex-row gap-8 mt-8">
            <div className="w-full lg:w-1/2 pr-4 lg:pr-10 flex flex-col min-h-[80vh]">
              {/* <StepIndicator steps={STEPS} current={step} /> */}

              <div className="mt-8 flex-1">
                {step === 0 && (
                  <div>
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Choose your frontend</h2>
                      <p className="text-sm text-gray-500 mt-1">Select the frontend framework for your project.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {manifest?.frontends.map((f, i) => (
                        <div key={f.id} style={fadeIn(i)}>
                          <OptionCard
                            id={f.id} name={f.name}
                            selected={frontend === f.id} onSelect={setFrontend}
                            logo={LOGOS[f.id]} available={f.available}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {manifest?.frontends.find(f => f.id === frontend)?.name}
                        <button onClick={() => { setFrontend(null); setStep(0) }} className="text-gray-400 hover:text-gray-600 underline ml-1 text-xs">change</button>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Choose your backend</h2>
                      <p className="text-sm text-gray-500 mt-1">Select the backend framework for your API.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {manifest?.backends.map((b, i) => (
                        <div key={b.id} style={fadeIn(i)}>
                          <OptionCard
                            id={b.id} name={b.name}
                            selected={backend === b.id} onSelect={setBackend}
                            logo={LOGOS[b.id]} available={b.available}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {manifest?.frontends.find(f => f.id === frontend)?.name}
                        <span className="text-gray-300 mx-1">+</span>
                        {manifest?.backends.find(b => b.id === backend)?.name}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Choose a database</h2>
                      <p className="text-sm text-gray-500 mt-1">Optionally add a database with CRUD endpoints.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {manifest?.databases.map((d, i) => (
                        <div key={d.id} style={fadeIn(i)}>
                          <OptionCard
                            id={d.id} name={d.name}
                            selected={database === d.id} onSelect={setDatabase}
                            logo={LOGOS[d.id]} available={d.available}
                          />
                        </div>
                      ))}
                    </div>

                    {(database === 'postgres' || database === 'mysql' || database === 'mongodb') && (
                      <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
                        <input type="checkbox" checked={docker} onChange={e => setDocker(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black" />
                        <span className="text-sm text-gray-600">Include Docker Compose</span>
                      </label>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {manifest?.frontends.find(f => f.id === frontend)?.name}
                        <span className="text-gray-300 mx-1">+</span>
                        {manifest?.backends.find(b => b.id === backend)?.name}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Choose a storage</h2>
                      <p className="text-sm text-gray-500 mt-1">Optionally add file storage.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {manifest?.storages.map((s, i) => (
                        <div key={s.id} style={fadeIn(i)}>
                          <OptionCard
                            id={s.id} name={s.name}
                            selected={storage === s.id} onSelect={setStorage}
                            logo={LOGOS[s.id] || <div className="w-5 h-5 rounded-full border border-gray-300" />}
                            available={s.available}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {manifest?.frontends.find(f => f.id === frontend)?.name}
                        <span className="text-gray-300 mx-1">+</span>
                        {manifest?.backends.find(b => b.id === backend)?.name}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Choose auth</h2>
                      <p className="text-sm text-gray-500 mt-1">Optionally add authentication.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {manifest?.auths.map((a, i) => (
                        <div key={a.id} style={fadeIn(i)}>
                          <OptionCard
                            id={a.id} name={a.name}
                            selected={auth === a.id} onSelect={setAuth}
                            logo={LOGOS[a.id] || <div className="w-5 h-5 rounded-full border border-gray-300" />}
                            available={a.available}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {manifest?.frontends.find(f => f.id === frontend)?.name}
                        <span className="text-gray-300 mx-1">+</span>
                        {manifest?.backends.find(b => b.id === backend)?.name}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Choose a mail service</h2>
                      <p className="text-sm text-gray-500 mt-1">Optionally add transactional email.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {manifest?.mails.map((m, i) => (
                        <div key={m.id} style={fadeIn(i)}>
                          <OptionCard
                            id={m.id} name={m.name}
                            selected={mail === m.id} onSelect={setMail}
                            logo={LOGOS[m.id] || <div className="w-5 h-5 rounded-full border border-gray-300" />}
                            available={m.available}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {manifest?.frontends.find(f => f.id === frontend)?.name}
                        <span className="text-gray-300 mx-1">+</span>
                        {manifest?.backends.find(b => b.id === backend)?.name}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Choose a payment provider</h2>
                      <p className="text-sm text-gray-500 mt-1">Optionally add payment processing.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {manifest?.payments.map((p, i) => (
                        <div key={p.id} style={fadeIn(i)}>
                          <OptionCard
                            id={p.id} name={p.name}
                            selected={payments === p.id} onSelect={setPayments}
                            logo={LOGOS[p.id] || <div className="w-5 h-5 rounded-full border border-gray-300" />}
                            available={p.available}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div>
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg mb-3">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {manifest?.frontends.find(f => f.id === frontend)?.name}
                        <span className="text-gray-300 mx-1">+</span>
                        {manifest?.backends.find(b => b.id === backend)?.name}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">Choose a style</h2>
                      <p className="text-sm text-gray-500 mt-1">Optionally add a CSS framework.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {manifest?.styles.map((s, i) => (
                        <div key={s.id} style={fadeIn(i)}>
                          <OptionCard
                            id={s.id} name={s.name}
                            selected={style === s.id} onSelect={setStyle}
                            logo={LOGOS[s.id] || <div className="w-5 h-5 rounded-full border border-gray-300" />}
                            available={s.available}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between py-6 border-t border-gray-100">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className={`
                    inline-flex items-center gap-1.5 px-6 py-2 text-sm font-semibold rounded-xl transition-all duration-200
                    ${step === 0
                      ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                    }
                  `}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  Back
                </button>
                {step < 7 && (
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext()}
                    className={`
                      inline-flex items-center gap-1.5 px-6 py-2 text-sm font-semibold rounded-xl transition-all duration-200
                      ${canGoNext()
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                      }
                    `}
                  >
                    Next
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <LivePreview
                frontend={frontend} backend={backend} auth={auth} mail={mail} payments={payments} storage={storage} style={style} database={database}
                docker={docker} setDocker={setDocker}
                step={step} downloading={downloading} handleDownload={handleDownload} handleReset={handleReset} manifest={manifest}
                generating={showOverlay} onGenerateReady={onOverlayReady} treeData={treeData}
                supabaseUrl={supabaseUrl} setSupabaseUrl={setSupabaseUrl} supabaseKey={supabaseKey} setSupabaseKey={setSupabaseKey}
                databaseUrl={databaseUrl} setDatabaseUrl={setDatabaseUrl}
                appwriteEndpoint={appwriteEndpoint} setAppwriteEndpoint={setAppwriteEndpoint}
                appwriteProjectId={appwriteProjectId} setAppwriteProjectId={setAppwriteProjectId}
                appwriteApiKey={appwriteApiKey} setAppwriteApiKey={setAppwriteApiKey}
                r2Endpoint={r2Endpoint} setR2Endpoint={setR2Endpoint} r2AccessKey={r2AccessKey} setR2AccessKey={setR2AccessKey}
                r2SecretKey={r2SecretKey} setR2SecretKey={setR2SecretKey} r2BucketName={r2BucketName} setR2BucketName={setR2BucketName} r2PublicUrl={r2PublicUrl} setR2PublicUrl={setR2PublicUrl}
                s3Endpoint={s3Endpoint} setS3Endpoint={setS3Endpoint} s3AccessKey={s3AccessKey} setS3AccessKey={setS3AccessKey}
                s3SecretKey={s3SecretKey} setS3SecretKey={setS3SecretKey} s3BucketName={s3BucketName} setS3BucketName={setS3BucketName}
                s3Region={s3Region} setS3Region={setS3Region} s3PublicUrl={s3PublicUrl} setS3PublicUrl={setS3PublicUrl}
                supabaseStorageUrl={supabaseStorageUrl} setSupabaseStorageUrl={setSupabaseStorageUrl}
                supabaseStorageKey={supabaseStorageKey} setSupabaseStorageKey={setSupabaseStorageKey}
                clerkPublishableKey={clerkPublishableKey} setClerkPublishableKey={setClerkPublishableKey}
                clerkSecretKey={clerkSecretKey} setClerkSecretKey={setClerkSecretKey}
                auth0Domain={auth0Domain} setAuth0Domain={setAuth0Domain}
                auth0ClientId={auth0ClientId} setAuth0ClientId={setAuth0ClientId}
                mailgunApiKey={mailgunApiKey} setMailgunApiKey={setMailgunApiKey} mailgunDomain={mailgunDomain} setMailgunDomain={setMailgunDomain}
                mailtrapApiToken={mailtrapApiToken} setMailtrapApiToken={setMailtrapApiToken}
                sendgridApiKey={sendgridApiKey} setSendgridApiKey={setSendgridApiKey}
                mailchimpApiKey={mailchimpApiKey} setMailchimpApiKey={setMailchimpApiKey} mailchimpServerPrefix={mailchimpServerPrefix} setMailchimpServerPrefix={setMailchimpServerPrefix}
                stripePublishableKey={stripePublishableKey} setStripePublishableKey={setStripePublishableKey} stripeSecretKey={stripeSecretKey} setStripeSecretKey={setStripeSecretKey}
                razorpayKeyId={razorpayKeyId} setRazorpayKeyId={setRazorpayKeyId} razorpayKeySecret={razorpayKeySecret} setRazorpayKeySecret={setRazorpayKeySecret}
                cashfreeAppId={cashfreeAppId} setCashfreeAppId={setCashfreeAppId} cashfreeSecretKey={cashfreeSecretKey} setCashfreeSecretKey={setCashfreeSecretKey}
                paypalClientId={paypalClientId} setPaypalClientId={setPaypalClientId} paypalClientSecret={paypalClientSecret} setPaypalClientSecret={setPaypalClientSecret}
                mongodbUri={mongodbUri} setMongodbUri={setMongodbUri}
                mysqlUrl={mysqlUrl} setMysqlUrl={setMysqlUrl}
                dbHost={dbHost} setDbHost={setDbHost} dbPort={dbPort} setDbPort={setDbPort}
                dbUser={dbUser} setDbUser={setDbUser} dbPassword={dbPassword} setDbPassword={setDbPassword}
                dbName={dbName} setDbName={setDbName}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
