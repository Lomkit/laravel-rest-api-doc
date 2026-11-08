<script setup lang="ts">
withDefaults(defineProps<{
  id?: string
  eyebrow: string
  icon: string
  title: string
  description: string
  points?: string[]
  link?: { label: string, to: string }
  reverse?: boolean
}>(), {
  id: undefined,
  points: () => [],
  link: undefined,
  reverse: false
})
</script>

<template>
  <section
    :id="id"
    class="relative py-16 sm:py-24"
  >
    <UContainer>
      <div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <LandingReveal
          class="lg:col-span-5"
          :class="reverse ? 'lg:order-2' : ''"
        >
          <div class="flex items-center gap-2 text-sm font-semibold text-primary">
            <span class="flex size-7 items-center justify-center rounded-lg bg-primary/10 ring ring-primary/20">
              <UIcon
                :name="icon"
                class="size-4"
              />
            </span>
            {{ eyebrow }}
          </div>
          <h2 class="mt-4 text-3xl font-bold tracking-tight text-balance text-highlighted sm:text-4xl">
            {{ title }}
          </h2>
          <p class="mt-4 text-base text-pretty text-muted sm:text-lg">
            {{ description }}
          </p>
          <ul
            v-if="points.length"
            class="mt-6 space-y-3"
          >
            <li
              v-for="point in points"
              :key="point"
              class="flex gap-3 text-sm text-toned"
            >
              <UIcon
                name="i-lucide-check"
                class="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span>{{ point }}</span>
            </li>
          </ul>
          <UButton
            v-if="link"
            :to="link.to"
            :label="link.label"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-right"
            class="mt-6 px-0 text-highlighted"
          />
        </LandingReveal>

        <LandingReveal
          v-slot="{ visible }"
          class="min-w-0 lg:col-span-7"
          :class="reverse ? 'lg:order-1' : ''"
          :delay="120"
        >
          <slot :visible="visible" />
        </LandingReveal>
      </div>
    </UContainer>
  </section>
</template>
