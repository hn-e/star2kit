import { useState } from 'react'

export default function Push() {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('http://localhost:3001/api/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    })
    setName('')
    setMessage('')
  }

  return (
    <div>
      <h1>Push Data</h1>
      <form onSubmit={handleSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={message} onChange={e => setMessage(e.target.value)} placeholder="Message" required />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
