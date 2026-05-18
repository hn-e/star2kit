import { Router } from 'express'
import multer from 'multer'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

const s3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT,
  region: 'auto',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY!,
    secretAccessKey: process.env.R2_SECRET_KEY!,
  },
})

const BUCKET = process.env.R2_BUCKET_NAME!

router.post('/', upload.single('file'), async (req, res) => {
  const file = req.file!
  const key = `${Date.now()}-${file.originalname}`
  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  }))
  res.json({ key, url: `${process.env.R2_PUBLIC_URL || ''}/${key}` })
})

export default router
