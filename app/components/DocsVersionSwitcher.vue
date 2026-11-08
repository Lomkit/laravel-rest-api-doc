<script setup lang="ts">
const version = useDocsVersion()
const equivalent = useDocsEquivalent()

const links = computed(() => docsVersions.map(docsVersion => ({
  name: docsVersion.name,
  to: equivalent(docsVersion),
  active: docsVersion.name === version.value.name
})))
</script>

<template>
  <UFieldGroup
    size="xs"
    aria-label="Documentation version"
    data-docs-version-switcher
  >
    <UButton
      v-for="link of links"
      :key="link.name"
      :label="link.name"
      :to="link.to"
      :color="link.active ? 'primary' : 'neutral'"
      :variant="link.active ? 'subtle' : 'outline'"
      :aria-current="link.active ? 'true' : undefined"
      class="font-semibold"
    />
  </UFieldGroup>
</template>
