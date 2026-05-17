import { DatabaseSync } from 'node:sqlite'

const db = new DatabaseSync('data.db')

export function initDB() {
  db.exec(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL
  )`)
}

export default db
