import { useEffect, useState } from 'react'

interface Item { id: number; name: string; message: string }

export default function List() {
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    fetch('http://localhost:3001/api/list')
      .then(res => res.json())
      .then(setItems)
  }, [])

  return (
    <div>
      <h1>List Data</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}><strong>{item.name}</strong>: {item.message}</li>
        ))}
      </ul>
    </div>
  )
}
