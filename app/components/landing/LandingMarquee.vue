<script setup lang="ts">
const items = [
  { icon: 'i-lucide-filter', label: 'Filters and relation filters' },
  { icon: 'i-lucide-network', label: 'Nested includes' },
  { icon: 'i-lucide-sigma', label: 'Aggregates' },
  { icon: 'i-lucide-text-search', label: 'Text search and Scout engines' },
  { icon: 'i-lucide-git-merge', label: 'Nested writes' },
  { icon: 'i-lucide-zap', label: 'Actions' },
  { icon: 'i-lucide-chart-column', label: 'Metrics' },
  { icon: 'i-lucide-shield-check', label: 'Policies and gates' },
  { icon: 'i-lucide-scan', label: 'Perimeter queries' },
  { icon: 'i-lucide-form-input', label: 'Precognition' },
  { icon: 'i-lucide-book-open', label: 'OpenAPI' },
  { icon: 'i-lucide-file-down', label: 'Exports' }
]
</script>

<template>
  <div
    class="lr-marquee relative overflow-hidden border-y border-default bg-elevated/30 py-4"
    aria-label="Features"
  >
    <div class="lr-marquee-track flex w-max gap-3">
      <template
        v-for="copy in 2"
        :key="copy"
      >
        <span
          v-for="item in items"
          :key="`${copy}-${item.label}`"
          class="flex shrink-0 items-center gap-2 rounded-full border border-default bg-default px-3.5 py-1.5 text-sm text-toned dark:bg-neutral-950/60"
          :class="{ 'lr-dup': copy === 2 }"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <UIcon
            :name="item.icon"
            class="size-4 text-primary"
          />
          {{ item.label }}
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.lr-marquee {
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
}

.lr-marquee-track {
  padding-inline: 0.375rem;
}

@media (prefers-reduced-motion: no-preference) {
  .lr-marquee-track {
    animation: lr-marquee 48s linear infinite;
  }

  .lr-marquee:hover .lr-marquee-track {
    animation-play-state: paused;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lr-marquee-track {
    flex-wrap: wrap;
    justify-content: center;
    width: auto;
  }

  .lr-dup {
    display: none;
  }
}

@keyframes lr-marquee {
  to { transform: translateX(-50%); }
}
</style>
