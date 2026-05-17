import { NextRequest } from 'next/server'
import { generateProject } from '@/lib/generator'
import type { ProjectOptions } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body: ProjectOptions = await req.json()
  const zipBuffer = await generateProject(body)

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': 'attachment; filename="project.zip"',
    },
  })
}
