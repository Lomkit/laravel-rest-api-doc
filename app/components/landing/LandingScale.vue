<script setup lang="ts">
defineProps<{
  visible?: boolean
}>()

const engines = ['Contains', 'FullText', 'Meilisearch', 'Typesense', 'Algolia', 'Turbopuffer', 'database', 'collection']

const metrics = ['value', 'partition', 'progress', 'trend', 'table']

const bars = [34, 52, 41, 66, 58, 79, 72, 94]

const exportCode = `$rows = Rest::search(OrderResource::class)
    ->as($request->user())
    ->payload($request->input('search', []))
    ->lazy();

foreach ($rows as $row) {
    fputcsv($file, [$row['id'], $row['reference']]);
}`

const queueCode = `#[Queue('exports')]
class ExportOrders extends Action
    implements ShouldQueue`
</script>

<template>
  <div
    class="grid gap-4 sm:grid-cols-2"
    :class="{ 'is-visible': visible }"
  >
    <div class="lr-tile rounded-xl border border-default bg-default p-5 dark:bg-neutral-950/80">
      <div class="flex items-center gap-2 text-sm font-semibold text-highlighted">
        <UIcon
          name="i-lucide-text-search"
          class="size-4 text-primary"
        />
        Text search, on your terms
      </div>
      <p class="mt-1.5 text-xs text-muted">
        Start with LIKE, move to the full-text index of your database, then to a Scout engine, behind the same search.text key.
      </p>
      <div class="mt-4 flex flex-wrap gap-1.5">
        <span
          v-for="(engine, index) in engines"
          :key="engine"
          class="lr-chip rounded-full border border-default bg-elevated/60 px-2.5 py-1 font-mono text-[11px] text-toned"
          :style="{ '--i': index }"
        >{{ engine }}</span>
      </div>
    </div>

    <div
      class="lr-tile rounded-xl border border-default bg-default p-5 dark:bg-neutral-950/80"
      style="--t: 1"
    >
      <div class="flex items-center gap-2 text-sm font-semibold text-highlighted">
        <UIcon
          name="i-lucide-chart-column"
          class="size-4 text-primary"
        />
        Metrics with the same filters
      </div>
      <p class="mt-1.5 text-xs text-muted">
        Each metric gets its route, reads the perimeter and the search of the request, and can stay cached.
      </p>
      <div
        class="mt-4 flex h-16 items-end gap-1.5"
        aria-hidden="true"
      >
        <span
          v-for="(height, index) in bars"
          :key="index"
          class="lr-bar flex-1 origin-bottom rounded-t bg-gradient-to-t from-primary/50 to-primary"
          :style="{ 'height': `${height}%`, '--i': index }"
        />
      </div>
      <div class="mt-3 flex flex-wrap gap-1.5">
        <span
          v-for="metric in metrics"
          :key="metric"
          class="rounded-md bg-elevated px-2 py-0.5 font-mono text-[11px] text-muted"
        >{{ metric }}</span>
      </div>
    </div>

    <div
      class="lr-tile overflow-hidden rounded-xl border border-default bg-default sm:col-span-2 dark:bg-neutral-950/80"
      style="--t: 2"
    >
      <div class="grid md:grid-cols-[1fr_15rem]">
        <div class="min-w-0 py-4 text-[10.5px] leading-relaxed sm:text-[11px]">
          <LandingCode
            :code="exportCode"
            lang="php"
            class="overflow-x-auto"
          />
        </div>
        <div class="border-t border-default p-5 md:border-t-0 md:border-l">
          <div class="flex items-center gap-2 text-sm font-semibold text-highlighted">
            <UIcon
              name="i-lucide-file-down"
              class="size-4 text-primary"
            />
            Exports and jobs
          </div>
          <p class="mt-1.5 text-xs text-muted">
            Replay a client search outside HTTP, as a given user, with the same perimeter and policies. Rows stream by chunks.
          </p>
        </div>
      </div>
    </div>

    <div
      class="lr-tile rounded-xl border border-default bg-default p-5 dark:bg-neutral-950/80"
      style="--t: 3"
    >
      <div class="flex items-center gap-2 text-sm font-semibold text-highlighted">
        <UIcon
          name="i-lucide-layers"
          class="size-4 text-primary"
        />
        Queued and batched actions
      </div>
      <p class="mt-1.5 text-xs text-muted">
        Laravel queue attributes, batch progress on its own route, the worker runs as the user who asked.
      </p>
      <div class="-mx-5 mt-3 overflow-x-auto text-[10.5px] leading-relaxed sm:text-[11px]">
        <LandingCode
          :code="queueCode"
          lang="php"
          class="px-1"
        />
      </div>
    </div>

    <div
      class="lr-tile rounded-xl border border-default bg-default p-5 dark:bg-neutral-950/80"
      style="--t: 4"
    >
      <div class="flex items-center gap-2 text-sm font-semibold text-highlighted">
        <UIcon
          name="i-lucide-refresh-ccw"
          class="size-4 text-primary"
        />
        Writes that hold under load
      </div>
      <p class="mt-1.5 text-xs text-muted">
        Every mutation runs in one transaction, which can retry on deadlocks. Checks run in one batch before the first write, and decisions are cached.
      </p>
      <div class="mt-4 flex flex-wrap items-center gap-2 font-mono text-[11px]">
        <span class="rounded-md bg-elevated px-2 py-0.5 text-muted">transactions.attempts</span>
        <span class="rounded-md bg-elevated px-2 py-0.5 text-muted">authorizationCache()</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lr-motion .lr-tile {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(var(--t, 0) * 90ms);
}

.lr-motion .is-visible .lr-tile {
  opacity: 1;
  transform: none;
}

.lr-motion .lr-chip {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.35s ease, transform 0.35s ease;
  transition-delay: calc(0.4s + var(--i) * 60ms);
}

.lr-motion .is-visible .lr-chip {
  opacity: 1;
  transform: none;
}

.lr-motion .lr-bar {
  transform: scaleY(0.05);
  transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: calc(0.5s + var(--i) * 70ms);
}

.lr-motion .is-visible .lr-bar {
  transform: none;
}
</style>
