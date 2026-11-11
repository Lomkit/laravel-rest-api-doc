<script setup lang="ts">
import { toolboxTiles } from '~/data/landing/toolbox'
</script>

<template>
  <section
    id="toolbox"
    class="relative scroll-mt-16 py-14 sm:py-20"
  >
    <UContainer>
      <LandingHeading
        eyebrow="As your app grows"
        icon="i-lucide-blocks"
        title="Everything else a real API needs"
        center
      />

      <div class="mt-12 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <LandingReveal
          v-for="(tile, index) in toolboxTiles"
          :key="tile.title"
          :delay="(index % 4) * 70"
          :class="tile.wide ? 'sm:col-span-2' : ''"
        >
          <NuxtLink
            :to="tile.link"
            class="lt-tile group"
          >
            <span class="flex items-center gap-3">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring ring-primary/20 transition-transform duration-300 group-hover:scale-110">
                <UIcon
                  :name="tile.icon"
                  class="size-4.5 text-primary"
                />
              </span>
              <span class="font-semibold text-highlighted">{{ tile.title }}</span>
              <UIcon
                name="i-lucide-arrow-up-right"
                class="ml-auto size-4 shrink-0 text-dimmed transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
              />
            </span>
            <span class="mt-3 block text-sm text-pretty text-muted">{{ tile.text }}</span>
            <div
              v-if="tile.code"
              class="relative mt-4 overflow-x-auto rounded-lg border border-default bg-elevated/50 py-3 text-[11px] leading-[1.65]"
            >
              <span
                v-if="tile.code.excerpt"
                class="absolute top-2 right-2 rounded-full border border-default bg-default px-2 font-mono text-[10px] text-muted"
              >excerpt</span>
              <LandingCode
                :code="tile.code.text"
                :lang="tile.code.lang"
              />
            </div>
          </NuxtLink>
        </LandingReveal>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.lt-tile {
  display: flex;
  height: 100%;
  flex-direction: column;
  border: 1px solid var(--ui-border);
  border-radius: 1rem;
  background: var(--ui-bg);
  padding: 1.25rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.dark .lt-tile { background: color-mix(in oklab, var(--ui-color-neutral-950) 70%, transparent); }

.lt-tile:hover {
  border-color: color-mix(in oklab, var(--ui-primary) 45%, transparent);
  box-shadow: 0 18px 40px -24px color-mix(in oklab, var(--ui-primary) 60%, transparent);
  transform: translateY(-2px);
}

.lt-tile:focus-visible { outline: 2px solid var(--ui-primary); outline-offset: 2px; }

@media (prefers-reduced-motion: reduce) {
  .lt-tile { transition: none; }
  .lt-tile:hover { transform: none; }
}
</style>
