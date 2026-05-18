import { useEffect, useState } from 'react'

interface FileItem { key: string; size: number; url: string }

export default function Files() {
  const [files, setFiles] = useState<FileItem[]>([])

  useEffect(() => {
    fetch('http://localhost:3001/api/files')
      .then(res => res.json())
      .then(setFiles)
  }, [])

  return (
    <div>
      <h1>Files</h1>
      <ul>
        {files.map(f => (
          <li key={f.key}><a href={f.url} target="_blank" rel="noreferrer">{f.key}</a> ({f.size} bytes)</li>
        ))}
      </ul>
    </div>
  )
}
