import { createSignal } from 'solid-js'

export default function Upload() {
  const [file, setFile] = createSignal<File | null>(null)
  const [url, setUrl] = createSignal('')

  const handleSubmit = async (e: Event) => {
    e.preventDefault()
    const f = file()
    if (!f) return
    const form = new FormData()
    form.append('file', f)
    const res = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: form })
    const data = await res.json()
    setUrl(data.url)
  }

  return (
    <div>
      <h1>Upload File</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={e => setFile(e.currentTarget.files?.[0] || null)} required />
        <button type="submit">Upload</button>
      </form>
      {url() && <p>Uploaded: <a href={url()} target="_blank" rel="noreferrer">{url()}</a></p>}
    </div>
  )
}
