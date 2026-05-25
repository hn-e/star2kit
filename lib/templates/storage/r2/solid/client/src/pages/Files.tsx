import { createSignal, onMount, For } from 'solid-js'

interface FileItem { key: string; size: number; url: string }

export default function Files() {
  const [files, setFiles] = createSignal<FileItem[]>([])

  onMount(async () => {
    const res = await fetch('http://localhost:3001/api/files')
    setFiles(await res.json())
  })

  return (
    <div>
      <h1>Files</h1>
      <ul>
        <For each={files()}>{f =>
          <li><a href={f.url} target="_blank" rel="noreferrer">{f.key}</a> ({f.size} bytes)</li>
        }</For>
      </ul>
    </div>
  )
}
