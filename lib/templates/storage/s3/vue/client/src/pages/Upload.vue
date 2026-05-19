<template>
  <div>
    <h1>Upload File</h1>
    <form @submit.prevent="handleSubmit">
      <input type="file" @change="onFileChange" required />
      <button type="submit">Upload</button>
    </form>
    <p v-if="url">Uploaded: <a :href="url" target="_blank" rel="noreferrer">{{ url }}</a></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const file = ref<File | null>(null)
const url = ref('')

function onFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  file.value = input.files?.[0] || null
}

async function handleSubmit() {
  if (!file.value) return
  const form = new FormData()
  form.append('file', file.value)
  const res = await fetch('http://localhost:3001/api/upload', { method: 'POST', body: form })
  const data = await res.json()
  url.value = data.url
}
</script>
