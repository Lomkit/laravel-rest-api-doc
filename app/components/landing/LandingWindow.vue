<script setup lang="ts">
defineProps<{
  title?: string
  icon?: string
}>()
</script>

<template>
  <div class="lw relative flex flex-col overflow-hidden rounded-xl border border-default bg-default shadow-xl shadow-black/5 dark:bg-neutral-950/80 dark:shadow-black/40">
    <div class="flex h-10 shrink-0 items-center gap-3 border-b border-default bg-elevated/60 px-4">
      <div
        class="flex gap-1.5"
        aria-hidden="true"
      >
        <span class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
        <span class="size-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700" />
      </div>
      <slot name="title">
        <div
          v-if="title"
          class="flex min-w-0 items-center gap-1.5 truncate font-mono text-xs text-muted"
        >
          <UIcon
            v-if="icon"
            :name="icon"
            class="size-3.5 shrink-0"
          />
          <span class="truncate">{{ title }}</span>
        </div>
      </slot>
      <div class="ml-auto flex items-center gap-2">
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>
