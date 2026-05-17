<template>
  <div>
    <h1>Push Data</h1>
    <form @submit.prevent="handleSubmit">
      <input v-model="name" placeholder="Name" required />
      <input v-model="message" placeholder="Message" required />
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const message = ref('')

async function handleSubmit() {
  await fetch('http://localhost:3001/api/push', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: name.value, message: message.value }),
  })
  name.value = ''
  message.value = ''
}
</script>
