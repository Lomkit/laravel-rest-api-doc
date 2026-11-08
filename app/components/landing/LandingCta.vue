<template>
  <section class="relative py-16 sm:py-24">
    <UContainer>
      <LandingReveal class="lr-cta relative isolate overflow-hidden rounded-3xl border border-default px-6 py-14 text-center sm:px-12 sm:py-20">
        <div
          class="lr-cta-bg pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        />
        <h2 class="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance text-highlighted sm:text-5xl">
          Your next API is one resource away
        </h2>
        <p class="mx-auto mt-5 max-w-xl text-base text-pretty text-muted sm:text-lg">
          Install the package, run the quick start, and send your first search in a few minutes.
        </p>
        <div class="mt-8 flex flex-col items-center gap-4">
          <LandingInstall command="php artisan rest:quick-start" />
          <div class="flex flex-wrap items-center justify-center gap-3">
            <UButton
              to="/getting-started/introduction"
              size="xl"
              trailing-icon="i-lucide-arrow-right"
            >
              Read the documentation
            </UButton>
            <UButton
              to="/getting-started/upgrade-guide"
              size="xl"
              color="neutral"
              variant="subtle"
              icon="i-lucide-arrow-up-circle"
            >
              Upgrade from 2.x
            </UButton>
          </div>
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
            label="Sponsor the project"
          />
        </div>
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
