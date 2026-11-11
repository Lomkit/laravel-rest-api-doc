<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('landing').path('/').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '',
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: 'https://laravel-rest-api.lomkit.com/social-card.png',
  twitterImage: 'https://laravel-rest-api.lomkit.com/social-card.png'
})

useHead({
  script: [{
    key: 'lr-motion',
    tagPosition: 'head',
    innerHTML: 'try{if(!matchMedia(\'(prefers-reduced-motion: reduce)\').matches)document.documentElement.classList.add(\'lr-motion\')}catch(e){}'
  }]
})

onMounted(() => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('lr-motion')
  }
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('lr-motion')
})
</script>

<template>
  <div v-if="page">
    <LandingHero />

    <LandingPlayground />

    <LandingEndpoints />

    <LandingGuards />

    <LandingFrontend />

    <LandingOpenApi />

    <LandingToolbox />

    <LandingCta />
  </div>
</template>
