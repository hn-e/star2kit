import { createSignal, onMount, For } from 'solid-js'

interface Item { id: number; name: string; message: string }

export default function List() {
  const [items, setItems] = createSignal<Item[]>([])

  onMount(async () => {
    const res = await fetch('http://localhost:3001/api/list')
    setItems(await res.json())
  })

  return (
    <div>
      <h1>List Data</h1>
      <ul>
        <For each={items()}>{item =>
          <li><strong>{item.name}</strong>: {item.message}</li>
        }</For>
      </ul>
    </div>
  )
}
