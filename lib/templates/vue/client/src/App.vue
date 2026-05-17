<template>
  <nav>
    <router-link to="/">Home</router-link>
    <router-link v-if="$route.name === 'push' || $route.name === 'list'" to="/push">Push</router-link>
    <router-link v-if="$route.name === 'push' || $route.name === 'list'" to="/list">List</router-link>
  </nav>
  <router-view />
</template>

<style>
body { font-family: system-ui, sans-serif; margin: 2rem; background: #fafafa; }
nav { display: flex; gap: 1rem; margin-bottom: 2rem; }
a { color: #2563eb; text-decoration: none; }
a:hover { text-decoration: underline; }
button { padding: 0.5rem 1rem; background: #2563eb; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
input { padding: 0.5rem; margin-right: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
ul { list-style: none; padding: 0; }
li { padding: 0.5rem 0; border-bottom: 1px solid #eee; }
</style>
