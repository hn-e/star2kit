import { useState } from 'react'

export default function Upload() {
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: form })
    const data = await res.json()
    setUrl(data.url)
  }

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} required />
        <button type="submit">Upload</button>
      </form>
      {url && <p>Uploaded: <a href={url} target="_blank" rel="noreferrer">{url}</a></p>}
    </div>
  )
}
