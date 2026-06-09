import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**': ['./lib/templates/**/*'],
  },
}

export default nextConfig
