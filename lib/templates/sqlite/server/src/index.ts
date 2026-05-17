import express from 'express'
import cors from 'cors'
import { initDB } from './db'
import pushRouter from './routes/push'
import listRouter from './routes/list'

const app = express()
app.use(cors())
app.use(express.json())

initDB()

app.use('/api/push', pushRouter)
app.use('/api/list', listRouter)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.listen(3001, () => console.log('Server running on http://localhost:3001'))
