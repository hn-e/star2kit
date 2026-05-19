export async function GET() {
  return Response.json({
    frontends: [
      { id: 'vanilla', name: 'JavaScript', available: false },
      { id: 'jquery', name: 'jQuery', available: false },
      { id: 'react', name: 'React', available: true },
      { id: 'vue', name: 'Vue', available: true },
      { id: 'svelte', name: 'Svelte', available: false },
      { id: 'solid', name: 'Solid', available: false },
    ],
    backends: [
      { id: 'flask', name: 'Flask', available: true },
      { id: 'express', name: 'Express', available: true },
      { id: 'fastapi', name: 'FastAPI', available: false },
      { id: 'nextjs', name: 'Next.js', available: false },
      { id: 'django', name: 'Django', available: false },
    ],
    databases: [
      { id: 'none', name: 'None', available: true },
      { id: 'sqlite', name: 'SQLite', available: true },
      { id: 'supabase', name: 'Supabase', available: false },
      { id: 'postgres', name: 'PostgreSQL', available: false },
      { id: 'appwrite', name: 'Appwrite', available: false },
      { id: 'mysql', name: 'MySQL', available: false },
      { id: 'mongodb', name: 'MongoDB', available: false },
    ],
    storages: [
      { id: 'none', name: 'None', available: true },
      { id: 'local', name: 'Local', available: false },
      { id: 'r2', name: 'Cloudflare R2', available: true },
      { id: 's3', name: 'AWS S3', available: true },
      { id: 'supabase', name: 'Supabase', available: false },
    ],
    auths: [
      { id: 'none', name: 'None', available: true },
      { id: 'clerk', name: 'Clerk', available: true },
      { id: 'auth0', name: 'Auth0', available: true },
    ],
    styles: [
      { id: 'none', name: 'None', available: true },
      { id: 'tailwind', name: 'Tailwind CSS', available: false },
      { id: 'bootstrap', name: 'Bootstrap', available: false },
      { id: 'bulma', name: 'Bulma', available: false },
      { id: 'basic', name: 'Basic CSS', available: false },
    ],
  })
}
