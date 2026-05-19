<template>
  <div>
    <h1 v-if="isAuthenticated">Profile</h1>
    <h1 v-else>Sign In</h1>

    <div v-if="isLoading">Loading...</div>

    <div v-else-if="isAuthenticated && user">
      <p>Name: {{ user.name }}</p>
      <p>Email: {{ user.email }}</p>
      <button @click="logout">Sign Out</button>
    </div>

    <button v-else @click="login">Sign In with Auth0</button>
    <p style="margin-top: 1rem; font-size: 0.8rem; color: #666">Add <code>/login</code> as an Allowed Callback URL in your Auth0 dashboard, to see profile details and Sign Out button after logging in.</p>
  </div>
</template>

<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0()

function login() {
  loginWithRedirect()
}
</script>
