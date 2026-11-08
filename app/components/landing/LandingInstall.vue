<script setup lang="ts">
const props = withDefaults(defineProps<{
  command?: string
}>(), {
  command: 'composer require lomkit/laravel-rest-api'
})

const copied = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command)
    copied.value = true
    clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 1800)
  } catch {
    copied.value = false
  }
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="group inline-flex max-w-full items-center gap-2 rounded-lg border border-default bg-default/70 py-1.5 pr-1.5 pl-3 font-mono text-xs sm:gap-3 sm:pl-4 sm:text-sm shadow-sm backdrop-blur dark:bg-neutral-950/60">
    <span
      class="text-primary select-none"
      aria-hidden="true"
    >$</span>
    <code class="truncate text-highlighted">{{ command }}</code>
    <UButton
      :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
      :color="copied ? 'success' : 'neutral'"
      variant="ghost"
      size="sm"
      :aria-label="copied ? 'Copied' : 'Copy the install command'"
      @click="copy"
    />
  </div>
</template>
