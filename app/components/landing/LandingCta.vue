<script setup lang="ts">
const steps = [
  { label: 'Install the package', command: 'composer require lomkit/laravel-rest-api' },
  { label: 'Expose the models you pick', command: 'php artisan rest:quick-start' },
  { label: 'Send your first search', command: 'POST /api/products/search' }
]
</script>

<template>
  <section class="relative py-14 sm:py-20">
    <UContainer>
      <LandingReveal class="relative isolate overflow-hidden rounded-3xl border border-default px-6 py-14 sm:px-12 sm:py-20">
        <div
          class="lr-cta-bg pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        />
        <div class="mx-auto max-w-3xl text-center">
          <h2 class="text-3xl font-bold tracking-tight text-balance text-highlighted sm:text-5xl">
            Your models are ready. Give them an API.
          </h2>
          <p class="mx-auto mt-5 max-w-xl text-base text-pretty text-muted sm:text-lg">
            Three steps, and the rules you already wrote in Laravel.
          </p>
        </div>

        <ol class="mx-auto mt-10 grid grid-cols-1 max-w-4xl gap-3 md:grid-cols-3">
          <li
            v-for="(step, index) in steps"
            :key="step.label"
            class="flex min-w-0 flex-col gap-2 rounded-xl border border-default bg-default/70 p-4 backdrop-blur dark:bg-neutral-950/60"
          >
            <span class="flex items-center gap-2 text-sm font-medium text-highlighted">
              <span class="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-inverted">{{ index + 1 }}</span>
              {{ step.label }}
            </span>
            <code class="font-mono text-xs text-muted">
              <template
                v-for="word in step.command.split(' ')"
                :key="word"
              ><span class="whitespace-nowrap">{{ word }}</span>{{ ' ' }}</template>
            </code>
          </li>
        </ol>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <UButton
            to="/getting-started/quick-start"
            size="xl"
            trailing-icon="i-lucide-arrow-right"
          >
            Follow the quick start
          </UButton>
          <UButton
            to="/getting-started/introduction"
            size="xl"
            color="neutral"
            variant="subtle"
            icon="i-lucide-book-open"
          >
            Read the documentation
          </UButton>
        </div>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <UButton
            to="https://github.com/Lomkit/laravel-rest-api"
            target="_blank"
            color="neutral"
            variant="link"
            icon="i-simple-icons-github"
            label="Lomkit/laravel-rest-api"
          />
          <UButton
            to="https://github.com/sponsors/GautierDele"
            target="_blank"
            color="neutral"
            variant="link"
            icon="i-lucide-heart"
            label="Become a sponsor"
          />
          <UButton
            to="/getting-started/upgrade-guide#upgrading-to-30-from-2x"
            color="neutral"
            variant="link"
            icon="i-lucide-arrow-up-circle"
            label="Upgrade from 2.x"
          />
        </div>
        <p class="mt-6 text-center text-xs text-muted">
          Laravel Rest Api is MIT licensed and maintained by Lomkit.
        </p>
      </LandingReveal>
    </UContainer>
  </section>
</template>

<style scoped>
.lr-cta-bg {
  background:
    radial-gradient(60% 80% at 50% 0%, color-mix(in oklab, var(--ui-primary) 18%, transparent), transparent 70%),
    radial-gradient(40% 60% at 100% 100%, color-mix(in oklab, #f43f5e 10%, transparent), transparent 70%),
    var(--ui-bg-elevated);
}

.lr-cta-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--ui-border) 60%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--ui-border) 60%, transparent) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 40%, #000, transparent);
}
</style>
