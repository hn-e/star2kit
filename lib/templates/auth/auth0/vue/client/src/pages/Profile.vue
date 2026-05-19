<template>
  <div>
    <h1>Profile</h1>
    <p v-if="isLoading">Loading...</p>
    <div v-else-if="!isAuthenticated">
      <p>Please sign in to view your profile.</p>
      <a href="/login">Sign In</a>
    </div>
    <div v-else>
      <p>Name: {{ user?.name }}</p>
      <p>Email: {{ user?.email }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { user, isAuthenticated, isLoading } = useAuth0()
</script>
