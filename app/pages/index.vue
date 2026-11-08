<script setup lang="ts">
import { LandingChecks, LandingFrontend, LandingOpenApi, LandingRoutes, LandingScale } from '#components'

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

const sections = [
  {
    id: 'minutes',
    eyebrow: 'Declare',
    icon: 'i-lucide-rocket',
    title: 'An API in minutes, not sprints',
    description: 'Run rest:quick-start, or write a resource by hand: typed fields, relations, scopes, instructions, actions and metrics. One route line registers its endpoints.',
    points: [
      'Typed fields: ID, Text, Number, Integer, Boolean, Date, DateTime, Enum and Json.',
      'Generators for resources, controllers, policies, actions, instructions, metrics and responses.',
      'What you do not declare is not exposed.'
    ],
    link: { label: 'Write your first resource', to: '/getting-started/quick-start' }
  },
  {
    id: 'authorization',
    eyebrow: 'Authorization',
    icon: 'i-lucide-lock-keyhole',
    title: 'Your policies, applied at every level',
    description: 'The package calls your Laravel policies on every resource a request reaches, scopes every query with your perimeter, and bounds every list with limits you can tune.',
    points: [
      'A denied check answers 403 before any 422, and before any query.',
      'Each check runs once per request; the abilities you choose stay cached between requests.',
      'With the denials renderer, a 403 lists each refused check with its path, ability and key.'
    ],
    link: { label: 'Read about policies', to: '/authorization/policies' }
  },
  {
    id: 'frontends',
    eyebrow: 'Frontends',
    icon: 'i-lucide-app-window',
    title: 'Built for the frontend you actually ship',
    description: 'Your interface asks the API what the user may do, instead of guessing. Buttons, forms and bulk actions follow your policies, and forms validate as the user types.',
    points: [
      'Details per user: fields, operators, relations, actions and authorizations, only the parts you ask for.',
      'Per-row gates with the messages of your policies.',
      'Laravel Precognition on search, mutate and actions.'
    ],
    link: { label: 'See the details endpoint', to: '/digging-deeper/details' }
  },
  {
    id: 'documented',
    eyebrow: 'Documented',
    icon: 'i-lucide-book-open',
    title: 'Documented and typed, out of the box',
    description: 'Scramble documents every endpoint from your declarations: one schema per filterable field with its operators and values, the records, the actions and the metrics. The schemas are tested against real responses.',
    points: [
      'An OpenAPI document your clients can generate code from.',
      'Typed PHP all the way: Larastan level 10.',
      'A Laravel Boost skill that knows the package.'
    ],
    link: { label: 'Generate the OpenAPI document', to: '/digging-deeper/openapi' }
  },
  {
    id: 'scale',
    eyebrow: 'Scale',
    icon: 'i-lucide-trending-up',
    title: 'Grows with your app',
    description: 'Start with SQL, add a search engine when the data grows. Queue the heavy actions, chart the numbers, export what a user sees, and keep one set of rules for all of it.',
    points: [],
    link: { label: 'Explore search engines', to: '/search/search-engines' }
  }
]

const visuals = [LandingRoutes, LandingChecks, LandingFrontend, LandingOpenApi, LandingScale]
</script>

<template>
  <div v-if="page">
    <LandingHero />

    <LandingMarquee />

    <LandingSection
      v-for="(section, index) in sections"
      :key="section.id"
      v-bind="section"
      :reverse="index % 2 === 1"
    >
      <template #default="{ visible }">
        <component
          :is="visuals[index]"
          :visible="visible"
        />
      </template>
    </LandingSection>

    <LandingCompare />

    <LandingCta />
  </div>
</template>
