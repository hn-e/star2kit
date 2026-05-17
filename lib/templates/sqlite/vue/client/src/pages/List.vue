<template>
  <div>
    <h1>List Data</h1>
    <ul>
      <li v-for="item in items" :key="item.id"><strong>{{ item.name }}</strong>: {{ item.message }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Item { id: number; name: string; message: string }

const items = ref<Item[]>([])

onMounted(async () => {
  const res = await fetch('http://localhost:3001/api/list')
  items.value = await res.json()
})
</script>
