import { createSignal } from 'solid-js'

export default function Push() {
  const [name, setName] = createSignal('')
  const [message, setMessage] = createSignal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    await fetch('http://localhost:3001/api/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name(), message: message() }),
    })
    setName('')
    setMessage('')
  }

  return (
    <div>
      <h1>Push Data</h1>
      <form onSubmit={handleSubmit}>
        <input value={name()} onInput={e => setName(e.currentTarget.value)} placeholder="Name" required />
        <input value={message()} onInput={e => setMessage(e.currentTarget.value)} placeholder="Message" required />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
