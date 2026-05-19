import { Router } from 'express'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

const router = Router()

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

const BUCKET = process.env.S3_BUCKET_NAME!

router.get('/', async (_req, res) => {
  const result = await s3.send(new ListObjectsV2Command({ Bucket: BUCKET }))
  const files = (result.Contents || []).map(obj => ({
    key: obj.Key,
    size: obj.Size,
    lastModified: obj.LastModified,
    url: `${process.env.S3_PUBLIC_URL || ''}/${obj.Key}`,
  }))
  res.json(files)
})

export default router
