import { Router } from 'express'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const router = Router()

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME!

router.get('/', async (_req, res) => {
  const result = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }))
  const files = (result.Contents || []).map(obj => ({
    key: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified,
    url: `${process.env.R2_PUBLIC_URL || ''}/${obj.Key}`,
  }))
  res.json(files)
})

export default router
