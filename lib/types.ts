export interface ProjectOptions {
  frontend: 'react' | 'vue'
  backend: 'express' | 'flask'
  sqlite: boolean
  storage: 'r2' | null
  r2Endpoint?: string
  r2AccessKey?: string
  r2SecretKey?: string
  r2BucketName?: string
  r2PublicUrl?: string
}
