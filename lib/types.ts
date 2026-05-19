export interface ProjectOptions {
  frontend: 'react' | 'vue'
  backend: 'express' | 'flask'
  sqlite: boolean
  storage: 'r2' | 's3' | null
  r2Endpoint?: string
  r2AccessKey?: string
  r2SecretKey?: string
  r2BucketName?: string
  r2PublicUrl?: string
  s3Endpoint?: string
  s3AccessKey?: string
  s3SecretKey?: string
  s3BucketName?: string
  s3Region?: string
}
