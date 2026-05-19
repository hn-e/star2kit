<template>
  <div>
    <h1>Files</h1>
    <ul>
      <li v-for="f in files" :key="f.key">
        <a :href="f.url" target="_blank" rel="noreferrer">{{ f.key }}</a> ({{ f.size }} bytes)
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface FileItem { key: string; size: number; url: string }

const files = ref<FileItem[]>([])

onMounted(async () => {
  const res = await fetch('http://localhost:3001/api/files')
  files.value = await res.json()
})
</script>
