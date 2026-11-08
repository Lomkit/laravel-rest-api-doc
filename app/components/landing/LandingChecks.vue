<script setup lang="ts">
defineProps<{
  visible?: boolean
}>()

const steps = [
  { icon: 'i-lucide-ruler', title: 'Limits', text: 'Sizes, depths and totals of every list are bounded. A list over its limit is one 422 on that list.' },
  { icon: 'i-lucide-door-open', title: 'Entry checks', text: 'viewAny on every resource the payload reaches, create on every created one, before validation.' },
  { icon: 'i-lucide-list-checks', title: 'Validation', text: 'Only declared fields, operators, relations and scopes. Anything else is a 422 on its key.' },
  { icon: 'i-lucide-scan', title: 'Perimeter', text: 'perimeterQuery() scopes searches, includes, writes, deletions and actions.' },
  { icon: 'i-lucide-rows-3', title: 'Row checks', text: 'update, delete and link abilities, in one batch, before the first write.' },
  { icon: 'i-lucide-badge-check', title: 'Gates', text: 'Each row can tell the client what the user may do with it.' }
]

const perimeter = `public function perimeterQuery(Builder $query): Builder
{
    return $query->where('team_id', $this->request()->user()->team_id);
}`
</script>

<template>
  <div
    class="lr-checks grid gap-4"
    :class="{ 'is-visible': visible }"
  >
    <div class="relative overflow-hidden rounded-xl border border-default bg-default p-5 shadow-xl shadow-black/5 sm:p-6 dark:bg-neutral-950/80 dark:shadow-black/40">
      <p class="text-xs font-semibold tracking-wider text-dimmed uppercase">
        What every request goes through
      </p>
      <ol class="relative mt-5 space-y-4">
        <span
          class="absolute top-3 bottom-3 left-[15px] w-px bg-default"
          aria-hidden="true"
        />
        <span
          class="lr-check-rail absolute top-3 bottom-3 left-[15px] w-px origin-top bg-primary"
          aria-hidden="true"
        />
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="lr-check relative flex gap-4"
          :style="{ '--i': index }"
        >
          <span class="lr-check-dot relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border border-default bg-default text-muted dark:bg-neutral-950">
            <UIcon
              :name="step.icon"
              class="size-4"
            />
          </span>
          <div class="min-w-0 pt-1">
            <p class="text-sm font-semibold text-highlighted">
              {{ step.title }}
            </p>
            <p class="mt-0.5 text-sm text-muted">
              {{ step.text }}
            </p>
          </div>
        </li>
      </ol>
    </div>

    <LandingWindow
      title="app/Rest/Resources/ProductResource.php"
      icon="i-vscode-icons-file-type-php3"
    >
      <div class="overflow-x-auto py-4 text-[11px] leading-relaxed sm:text-xs">
        <LandingCode
          lang="php"
          :code="perimeter"
        />
      </div>
    </LandingWindow>
  </div>
</template>

<style scoped>
.lr-check-dot {
  color: var(--ui-primary);
  border-color: color-mix(in oklab, var(--ui-primary) 45%, transparent);
  box-shadow: 0 0 0 4px color-mix(in oklab, var(--ui-primary) 12%, transparent);
}

.lr-motion .lr-checks:not(.is-visible) .lr-check-dot {
  color: var(--ui-text-muted);
  border-color: var(--ui-border);
  box-shadow: none;
}

.lr-motion .lr-check-dot {
  transition: color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
  transition-delay: calc(0.3s + var(--i) * 0.4s);
}

.lr-motion .lr-checks:not(.is-visible) .lr-check-rail {
  transform: scaleY(0);
}

.lr-motion .lr-check-rail {
  transition: transform 2.4s cubic-bezier(0.65, 0, 0.35, 1) 0.3s;
}

.lr-motion .lr-check {
  transition: opacity 0.4s ease calc(0.3s + var(--i) * 0.4s);
}

.lr-motion .lr-checks:not(.is-visible) .lr-check {
  opacity: 0.45;
}
</style>
