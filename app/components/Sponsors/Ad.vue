<script setup lang="ts">
const sponsor = useSponsors()
</script>

<template>
  <div
    v-if="sponsor"
    class="space-y-3"
  >
    <UPageCard
      :to="sponsor.link"
      target="_blank"
      :ui="{
        container: 'p-4 lg:p-5 sm:p-4 gap-y-1'
      }"
    >
      <template #header>
        <UColorModeImage
          :dark="sponsor.logo.dark"
          :light="sponsor.logo.light"
          :alt="sponsor.name"
        />
      </template>
      <p class="text-sm dark:text-gray-400 text-gray-500 text-center">
        {{ sponsor.text }}
      </p>
    </UPageCard>
  </div>
</template>
