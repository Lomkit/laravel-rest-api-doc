<script setup lang="ts">
const sponsor = useSponsors()
</script>

<template>
  <div class="space-y-3">
    <UPageCard :to="sponsor.link" target="_blank" :ui="{ header: { padding: 'p-0 sm:p-0' }, rounded: 'rounded', body: { padding: 'p-2 sm:p-2', base: 'text-center' } }">
      <template #header>
        <div class="px-2 py-2">
          <UColorModeImage :dark="sponsor.logo.dark" :light="sponsor.logo.light" :alt="sponsor.name" />
        </div>
      </template>
      <p class="text-sm dark:text-gray-400 text-gray-500 pb-1">
        {{ sponsor.text }}
      </p>
    </UPageCard>
  </div>
</template>
