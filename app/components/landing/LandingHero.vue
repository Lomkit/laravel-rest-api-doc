<template>
  <section class="relative isolate overflow-hidden">
    <div
      class="lr-hero-bg pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    >
      <div class="lr-hero-grid absolute inset-0" />
      <div class="lr-hero-glow lr-hero-glow-a absolute" />
      <div class="lr-hero-glow lr-hero-glow-b absolute" />
    </div>

    <UContainer class="pt-12 pb-16 sm:pt-16 lg:pt-20">
      <div class="mx-auto max-w-4xl text-center">
        <div class="lr-rise">
          <UButton
            to="/getting-started/upgrade-guide#upgrading-to-32-from-31"
            color="neutral"
            variant="outline"
            size="sm"
            class="rounded-full ps-1.5"
            trailing-icon="i-lucide-arrow-right"
          >
            <UBadge
              label="3.2"
              size="sm"
              class="rounded-full"
            />
            <span class="text-muted">Input-only fields and pivot persisters</span>
          </UButton>
        </div>

        <h1 class="lr-rise lr-rise-1 mt-7 text-4xl font-bold tracking-tight text-balance text-highlighted sm:text-6xl lg:text-7xl">
          Declare a resource.
          <span class="lr-gradient-text block">Get the whole API.</span>
        </h1>

        <p class="lr-rise lr-rise-2 mx-auto mt-6 max-w-2xl text-base text-pretty text-muted sm:text-lg">
          Laravel Rest Api turns your Eloquent models into a complete JSON API: search with filters and nested includes,
          nested writes in one transaction, actions and metrics, with your policies applied at every level.
          One resource, one controller, one route line.
        </p>

        <div class="lr-rise lr-rise-3 mt-8 flex flex-col items-center gap-4">
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
          <p class="text-xs text-dimmed">
            PHP 8.3+ · Laravel 13.30+ · MIT license
          </p>
        </div>
      </div>

      <div class="lr-rise lr-rise-4 relative mx-auto mt-12 max-w-6xl sm:mt-14">
        <div
          class="lr-demo-halo pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10"
          aria-hidden="true"
        />
        <LandingDemo />
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
  mask-image: radial-gradient(ellipse 70% 55% at 50% 0%, #000 30%, transparent 100%);
}

.lr-hero-glow {
  width: 60rem;
  height: 40rem;
  border-radius: 9999px;
  will-change: transform;
}

.lr-hero-glow-a {
  top: -22rem;
  left: 50%;
  margin-left: -38rem;
  background: radial-gradient(closest-side, color-mix(in oklab, var(--ui-primary) 28%, transparent), transparent);
}

.lr-hero-glow-b {
  top: -16rem;
  left: 50%;
  margin-left: -16rem;
  background: radial-gradient(closest-side, color-mix(in oklab, #f43f5e 16%, transparent), transparent);
}

.lr-demo-halo {
  background: radial-gradient(60% 50% at 50% 50%, color-mix(in oklab, var(--ui-primary) 14%, transparent), transparent 70%);
}

.lr-gradient-text {
  background: linear-gradient(100deg, var(--ui-primary) 10%, #f43f5e 55%, var(--ui-primary) 95%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

@media (prefers-reduced-motion: no-preference) {
  .lr-hero-glow-a {
    animation: lr-drift-a 18s ease-in-out infinite alternate;
  }

  .lr-hero-glow-b {
    animation: lr-drift-b 22s ease-in-out infinite alternate;
  }

  .lr-gradient-text {
    animation: lr-shine 8s ease-in-out infinite alternate;
  }

  .lr-rise {
    animation: lr-rise 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  }

  .lr-rise-1 { animation-delay: 0.08s; }
  .lr-rise-2 { animation-delay: 0.16s; }
  .lr-rise-3 { animation-delay: 0.24s; }
  .lr-rise-4 { animation-delay: 0.36s; animation-duration: 1.1s; }
}

@keyframes lr-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
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
