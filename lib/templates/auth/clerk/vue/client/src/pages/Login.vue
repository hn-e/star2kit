<template>
  <div>
    <h1 v-if="isSignedIn">Profile</h1>
    <h1 v-else>Sign In</h1>

    <div v-if="!isLoaded">Loading...</div>

    <div v-else-if="isSignedIn && user">
      <p>Name: {{ user.fullName }}</p>
      <p>Email: {{ user.primaryEmailAddress?.emailAddress }}</p>
      <button @click="signOut">Sign Out</button>
    </div>

    <button v-else @click="signIn">Sign In with Clerk</button>
    <p v-if="!isSignedIn" style="margin-top: 1rem; font-size: 0.8rem; color: #666">Add <code>/login</code> as an Allowed Callback URL in your Clerk dashboard.</p>
  </div>
</template>

<script setup lang="ts">
import { useUser, useSignIn, useSignOut } from '@clerk/clerk-vue'

const { isLoaded, isSignedIn, user } = useUser()
const { signIn } = useSignIn()
const { signOut } = useSignOut()
</script>
