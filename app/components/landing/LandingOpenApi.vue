<script setup lang="ts">
defineProps<{
  visible?: boolean
}>()

const operations = [
  { method: 'GET', summary: 'Get Show details' },
  { method: 'POST', summary: 'Search Show', active: true },
  { method: 'POST', summary: 'Mutate Show' },
  { method: 'POST', summary: 'Reschedule Shows' },
  { method: 'POST', summary: 'Shows Per Month' },
  { method: 'DELETE', summary: 'Delete Show' },
  { method: 'POST', summary: 'Restore Show' }
]

const schema = `{
  "type": "object",
  "properties": {
    "field": { "type": "string", "const": "status" },
    "operator": { "type": "string", "enum": ["=", "!="] },
    "value": {
      "type": "string",
      "enum": ["planned", "on_sale", "sold_out"]
    },
    "type": { "type": "string", "enum": ["and", "or"] }
  },
  "required": ["field", "value"],
  "additionalProperties": false
}`

const methodColor: Record<string, string> = {
  GET: 'text-sky-600 dark:text-sky-400',
  POST: 'text-amber-600 dark:text-amber-400',
  DELETE: 'text-rose-600 dark:text-rose-400'
}
</script>

<template>
  <div
    class="grid gap-4"
    :class="{ 'is-visible': visible }"
  >
    <LandingWindow
      title="/docs/api"
      icon="i-lucide-book-open"
    >
      <div class="grid sm:grid-cols-[13rem_1fr]">
        <ul class="hidden border-r border-default py-3 text-xs sm:block">
          <li class="px-4 pb-2 text-[11px] font-semibold tracking-wider text-dimmed uppercase">
            Show
          </li>
          <li
            v-for="(operation, index) in operations"
            :key="operation.summary"
            class="lr-op flex items-center gap-2 px-4 py-1.5"
            :class="operation.active ? 'bg-primary/10 text-highlighted' : 'text-muted'"
            :style="{ '--i': index }"
          >
            <span
              class="w-12 shrink-0 font-mono text-[10px] font-semibold"
              :class="methodColor[operation.method]"
            >{{ operation.method }}</span>
            <span class="truncate">{{ operation.summary }}</span>
          </li>
        </ul>
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 border-b border-default px-4 py-2.5 font-mono text-[11px]">
            <span class="text-dimmed">components.schemas.</span><span class="text-highlighted">ShowFilterStatus</span>
            <span class="text-dimmed">· oneOf[0]</span>
          </div>
          <div class="overflow-x-auto py-3 text-[10.5px] leading-relaxed sm:text-[11px]">
            <LandingCode
              :code="schema"
              lang="json"
            />
          </div>
        </div>
      </div>
    </LandingWindow>

    <div class="grid gap-4 sm:grid-cols-3">
      <div class="lr-badge rounded-xl border border-default bg-default p-4 dark:bg-neutral-950/80">
        <p class="font-mono text-2xl font-bold text-highlighted">
          OpenAPI
        </p>
        <p class="mt-1 text-xs text-muted">
          Through Scramble, with a schema per field, operator and relation.
        </p>
      </div>
      <div
        class="lr-badge rounded-xl border border-default bg-default p-4 dark:bg-neutral-950/80"
        style="--i: 1"
      >
        <p class="font-mono text-2xl font-bold text-highlighted">
          Level 10
        </p>
        <p class="mt-1 text-xs text-muted">
          Larastan at its highest level on the whole package.
        </p>
      </div>
      <div
        class="lr-badge rounded-xl border border-default bg-default p-4 dark:bg-neutral-950/80"
        style="--i: 2"
      >
        <p class="font-mono text-2xl font-bold text-highlighted">
          Boost
        </p>
        <p class="mt-1 text-xs text-muted">
          A Laravel Boost skill ships with the package.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lr-motion .lr-op,
.lr-motion .lr-badge {
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.lr-motion .lr-op {
  transition-delay: calc(0.3s + var(--i) * 70ms);
}

.lr-motion .lr-badge {
  transition-delay: calc(0.5s + var(--i, 0) * 120ms);
}

.lr-motion .is-visible .lr-op,
.lr-motion .is-visible .lr-badge {
  opacity: 1;
  transform: none;
}
</style>
