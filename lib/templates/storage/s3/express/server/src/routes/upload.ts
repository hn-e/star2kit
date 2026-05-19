import { Router } from 'express'
import multer from 'multer'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

const BUCKET = process.env.S3_BUCKET_NAME!

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file!
  const key = `${Date.now()}-${file.originalname}`
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }))
  res.json({ key, url: `${process.env.S3_PUBLIC_URL || ''}/${key}` })
})

export default router
