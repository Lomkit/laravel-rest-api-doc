<script setup lang="ts">
const props = defineProps<{
  visible?: boolean
}>()

const calls = [
  {
    method: 'GET',
    url: '/api/products?with=authorizations',
    caption: 'The details endpoint answers for the signed-in user: show the button, or not.',
    code: `"authorizations": {
  "viewAny": { "allowed": true, "message": null },
  "create": { "allowed": true, "message": null }
}`
  },
  {
    method: 'POST',
    url: '/api/products/search',
    caption: 'Send "selects" of id and name with "gates": ["update", "delete"]: each row carries the answers of your policy, message included.',
    code: `"data": [{
  "id": 2,
  "name": "Floor lamp",
  "gates": {
    "authorized_to_update": {
      "allowed": true, "message": null
    },
    "authorized_to_delete": {
      "allowed": false,
      "message": "This product has orders."
    }
  }
}]`
  },
  {
    method: 'POST',
    url: '/api/products/mutate · Precognition: true',
    caption: 'Laravel Precognition validates as the user types, with the rules and the label of the field: Integer::make(\'price\')->label(\'unit price\')->rules(\'min:0\'). Nothing is written.',
    code: `{
  "message": "The unit price field must be at least 0.",
  "errors": {
    "mutate.0.attributes.price": [
      "The unit price field must be at least 0."
    ]
  }
}`
  }
]

const active = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
let motion = false

function start() {
  stop()

  if (motion) {
    timer = setInterval(() => (active.value = (active.value + 1) % calls.length), 3800)
  }
}

function stop() {
  clearInterval(timer)
  timer = undefined
}

function choose(index: number) {
  active.value = index
  start()
}

onMounted(() => {
  motion = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (props.visible) {
    start()
  }
})

watch(() => props.visible, value => (value ? start() : stop()))

onBeforeUnmount(stop)
</script>

<template>
  <div class="grid items-start gap-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
    <div class="overflow-hidden rounded-xl border border-default bg-default shadow-xl shadow-black/5 dark:bg-neutral-950/80 dark:shadow-black/40">
      <div class="flex items-center justify-between border-b border-default px-4 py-3">
        <p class="text-sm font-semibold text-highlighted">
          Products
        </p>
        <span
          class="lr-target flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-inverted"
          :class="{ 'is-target': active === 0 }"
        >
          <UIcon
            name="i-lucide-plus"
            class="size-3.5"
          />
          New product
        </span>
      </div>

      <ul class="divide-y divide-default text-sm">
        <li class="flex items-center gap-3 px-4 py-3">
          <div class="min-w-0 flex-1">
            <p class="truncate font-medium text-highlighted">
              Desk lamp
            </p>
            <p class="text-xs text-dimmed">
              Lighting · 39
            </p>
          </div>
          <span class="rounded-md border border-default px-2 py-1 text-xs text-toned">Edit</span>
          <span class="rounded-md border border-default px-2 py-1 text-xs text-toned">Delete</span>
        </li>
        <li class="px-4 py-3">
          <div class="flex items-center gap-3">
            <div class="min-w-0 flex-1">
              <p class="truncate font-medium text-highlighted">
                Floor lamp
              </p>
              <p class="text-xs text-dimmed">
                Lighting · 129
              </p>
            </div>
            <span
              class="lr-target rounded-md border border-default px-2 py-1 text-xs text-toned"
              :class="{ 'is-target': active === 1 }"
            >Edit</span>
            <span
              class="lr-target cursor-not-allowed rounded-md border border-dashed border-default px-2 py-1 text-xs text-dimmed line-through decoration-dimmed/60"
              :class="{ 'is-target': active === 1 }"
            >Delete</span>
          </div>
          <p
            class="mt-2 flex items-center gap-1.5 text-xs transition-colors duration-300"
            :class="active === 1 ? 'text-primary' : 'text-dimmed'"
          >
            <UIcon
              name="i-lucide-info"
              class="size-3.5 shrink-0"
            />
            This product has orders.
          </p>
        </li>
      </ul>

      <div class="border-t border-default bg-elevated/40 px-4 py-4">
        <label
          class="text-xs font-medium text-toned"
          for="lr-price"
        >Unit price</label>
        <div
          class="lr-target mt-1.5 rounded-md"
          :class="{ 'is-target': active === 2 }"
        >
          <input
            id="lr-price"
            value="-5"
            readonly
            tabindex="-1"
            class="w-full rounded-md border border-error/60 bg-default px-3 py-1.5 font-mono text-sm text-highlighted outline-none"
          >
        </div>
        <p class="mt-1.5 text-xs text-error">
          The unit price field must be at least 0.
        </p>
      </div>
    </div>

    <div class="flex min-w-0 flex-col gap-2">
      <div
        class="flex flex-col gap-1.5"
        role="tablist"
        aria-label="Requests"
      >
        <button
          v-for="(call, index) in calls"
          :key="call.url"
          type="button"
          role="tab"
          :aria-selected="index === active"
          class="flex items-center gap-2 rounded-lg border px-3 py-2 text-left font-mono text-[11px] transition-colors duration-300"
          :class="index === active ? 'border-primary/40 bg-primary/5 text-highlighted' : 'border-default bg-default/50 text-muted hover:text-highlighted dark:bg-neutral-950/40'"
          @click="choose(index)"
        >
          <span
            class="font-semibold"
            :class="call.method === 'GET' ? 'text-sky-600 dark:text-sky-400' : 'text-amber-600 dark:text-amber-400'"
          >{{ call.method }}</span>
          <span class="truncate">{{ call.url }}</span>
        </button>
      </div>

      <div class="relative flex h-[330px] flex-col overflow-hidden rounded-xl border border-default bg-default shadow-xl shadow-black/5 dark:bg-neutral-950/80 dark:shadow-black/40">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-1"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="opacity-0"
        >
          <div
            :key="active"
            class="flex h-full flex-col"
          >
            <div class="flex-1 overflow-x-auto py-3 text-[10.5px] leading-relaxed sm:text-[11px]">
              <LandingCode
                :code="calls[active]!.code"
                lang="json"
              />
            </div>
            <p class="border-t border-default px-4 py-3 text-xs text-muted">
              {{ calls[active]!.caption }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lr-target {
  transition: box-shadow 0.35s ease, transform 0.35s ease;
}

.lr-target.is-target {
  box-shadow: 0 0 0 2px var(--ui-bg), 0 0 0 4px var(--ui-primary);
}

@media (prefers-reduced-motion: no-preference) {
  .lr-target.is-target {
    animation: lr-ping 1.6s ease-out 1;
  }
}

@keyframes lr-ping {
  0% { box-shadow: 0 0 0 2px var(--ui-bg), 0 0 0 4px var(--ui-primary), 0 0 0 4px color-mix(in oklab, var(--ui-primary) 50%, transparent); }
  100% { box-shadow: 0 0 0 2px var(--ui-bg), 0 0 0 4px var(--ui-primary), 0 0 0 14px transparent; }
}
</style>
