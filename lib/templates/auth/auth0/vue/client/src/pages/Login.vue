<template>
  <div>
    <h1>Sign In</h1>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="isAuthenticated">You are signed in. <a href="/profile">Go to profile</a></p>
    <button v-else @click="login">Sign In with Auth0</button>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()

function login() {
  loginWithRedirect()
}
</script>
