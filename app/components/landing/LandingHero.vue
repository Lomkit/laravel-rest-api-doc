<template>
  <section class="relative isolate overflow-hidden">
    <div
      class="pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    >
      <div class="lr-hero-grid absolute inset-0" />
      <div class="lr-hero-glow lr-hero-glow-a absolute" />
      <div class="lr-hero-glow lr-hero-glow-b absolute" />
    </div>

    <UContainer class="pt-10 pb-10 sm:pt-14 lg:pt-12 lg:pb-14">
      <div class="grid items-center gap-12 grid-cols-1 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-12 xl:gap-16">
        <div class="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
          <div class="lr-rise">
            <UButton
              to="/getting-started/upgrade-guide#upgrading-to-34-from-33"
              color="neutral"
              variant="outline"
              size="sm"
              class="rounded-full ps-1.5"
              trailing-icon="i-lucide-arrow-right"
            >
              <UBadge
                label="3.4"
                size="sm"
                class="rounded-full"
              />
              <span class="text-muted">Actions and metrics declared by their class</span>
            </UButton>
          </div>

          <h1 class="lr-rise lr-rise-1 mt-6 text-4xl font-bold tracking-tight text-balance text-highlighted sm:text-6xl lg:text-[3.25rem] lg:leading-[1.08] xl:text-[3.6rem]">
            Describe a model.
            <span class="lr-gradient-text block pb-1">Get a full API.</span>
          </h1>

          <p class="lr-rise lr-rise-2 mt-6 text-base text-pretty text-muted sm:text-lg">
            A Laravel package that turns your Eloquent models into a JSON API.
            List the fields and relations clients may use, add one route line, and get search, writes,
            deletes and your own actions, validated and checked against your policies.
          </p>

          <div class="lr-rise lr-rise-3 mt-8 flex flex-col items-center gap-4 lg:items-start">
            <LandingInstall />
            <div class="flex flex-wrap items-center justify-center gap-3">
              <UButton
                to="/getting-started/introduction"
                size="xl"
                trailing-icon="i-lucide-arrow-right"
              >
                Get started
              </UButton>
              <UButton
                to="https://github.com/Lomkit/laravel-rest-api"
                target="_blank"
                size="xl"
                color="neutral"
                variant="subtle"
                icon="i-simple-icons-github"
              >
                Star on GitHub
              </UButton>
            </div>
            <p class="text-xs text-muted">
              PHP 8.3+ · Laravel 13.30+ · MIT license
            </p>
          </div>
        </div>

        <div class="lr-rise lr-rise-4 relative min-w-0">
          <div
            class="lr-scene-halo pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10"
            aria-hidden="true"
          />
          <LandingHeroScene />
        </div>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.lr-hero-grid {
  background-image:
    linear-gradient(to right, color-mix(in oklab, var(--ui-border) 70%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklab, var(--ui-border) 70%, transparent) 1px, transparent 1px);
  background-size: 56px 56px;
  mask-image: radial-gradient(ellipse 80% 70% at 60% 0%, #000 30%, transparent 100%);
}

.lr-hero-glow {
  width: 60rem;
  height: 40rem;
  border-radius: 9999px;
  will-change: transform;
}

.lr-hero-glow-a {
  top: -24rem;
  left: 8%;
  background: radial-gradient(closest-side, color-mix(in oklab, var(--ui-primary) 26%, transparent), transparent);
}

.lr-hero-glow-b {
  top: -12rem;
  right: -14rem;
  background: radial-gradient(closest-side, color-mix(in oklab, #f43f5e 14%, transparent), transparent);
}

.lr-scene-halo {
  background: radial-gradient(55% 50% at 55% 50%, color-mix(in oklab, var(--ui-primary) 16%, transparent), transparent 70%);
}

.lr-gradient-text {
  background: linear-gradient(100deg, var(--ui-primary) 10%, #f43f5e 55%, var(--ui-primary) 95%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

@media (prefers-reduced-motion: no-preference) {
  .lr-hero-glow-a { animation: lr-drift-a 18s ease-in-out infinite alternate; }
  .lr-hero-glow-b { animation: lr-drift-b 22s ease-in-out infinite alternate; }
  .lr-gradient-text { animation: lr-shine 8s ease-in-out infinite alternate; }
  .lr-rise { animation: lr-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .lr-rise-1 { animation-delay: 0.08s; }
  .lr-rise-2 { animation-delay: 0.16s; }
  .lr-rise-3 { animation-delay: 0.24s; }
  .lr-rise-4 { animation-delay: 0.32s; animation-duration: 1.1s; }
}

@keyframes lr-rise {
  from { opacity: 0; transform: translateY(18px); }
}

@keyframes lr-drift-a {
  to { transform: translate3d(8rem, 3rem, 0) scale(1.1); }
}

@keyframes lr-drift-b {
  to { transform: translate3d(-10rem, 4rem, 0) scale(0.9); }
}

@keyframes lr-shine {
  to { background-position: 100% 0; }
}
</style>
