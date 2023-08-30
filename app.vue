<script setup>
import { withoutTrailingSlash } from 'ufo'

const route = useRoute()
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: () => [
    { rel: 'canonical', href: `https://laravel-rest-api.lomkit.com${withoutTrailingSlash(route.path)}` }
  ]
})
</script>
<template>
  <AppLayout>
    <NuxtPage />
  </AppLayout>
</template>
