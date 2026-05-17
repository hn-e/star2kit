import { Router } from 'express'
import db from '../db'

const router = Router()

router.post('/', (req, res) => {
  const { name, message } = req.body
  db.prepare('INSERT INTO items (name, message) VALUES (?, ?)').run(name, message)
  res.json({ status: 'ok' })
})

export default router
