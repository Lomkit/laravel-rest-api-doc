<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow: string
  icon: string
  title: string
  text?: string
  center?: boolean
}>(), {
  text: undefined,
  center: false
})
</script>

<template>
  <LandingReveal
    class="max-w-3xl"
    :class="center ? 'mx-auto text-center' : ''"
  >
    <p
      class="flex items-center gap-2 text-sm font-semibold text-primary"
      :class="center ? 'justify-center' : ''"
    >
      <span class="flex size-7 items-center justify-center rounded-lg bg-primary/10 ring ring-primary/20">
        <UIcon
          :name="icon"
          class="size-4"
        />
      </span>
      {{ eyebrow }}
    </p>
    <h2 class="mt-4 text-3xl font-bold tracking-tight text-balance text-highlighted sm:text-4xl lg:text-5xl">
      {{ title }}
    </h2>
    <p
      v-if="text"
      class="mt-4 text-base text-pretty text-muted sm:text-lg"
    >
      {{ text }}
    </p>
    <slot />
  </LandingReveal>
</template>
