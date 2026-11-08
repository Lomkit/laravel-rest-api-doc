<script setup lang="ts">
interface Step {
  method: 'GET' | 'POST' | 'DELETE'
  url: string
  note?: string
  request: string
  status: number
  statusText: string
  response: string
}

interface Scene {
  key: string
  label: string
  icon: string
  file: string
  php: string
  wiring: { file: string, code: string }
  caption: string
  steps: Step[]
}

const scenes: Scene[] = [
  {
    key: 'search',
    label: 'Search',
    icon: 'i-lucide-search',
    file: 'app/Rest/Resources/ProductResource.php',
    php: `class ProductResource extends Resource
{
    public static string $model = Product::class;

    public function fields(): array
    {
        return [
            ID::make('id'),
            Integer::make('category_id'),
            Text::make('name'),
            Integer::make('price'),
        ];
    }

    public function relations(): array
    {
        return [
            BelongsTo::make('category', CategoryResource::class),
        ];
    }
}`,
    wiring: { file: 'routes/api.php', code: `Rest::resource('products', ProductsController::class);` },
    caption: 'Filters on declared fields, includes of declared relations, pagination. Nothing else gets through.',
    steps: [{
      method: 'POST',
      url: '/api/products/search',
      request: `{
  "search": {
    "filters": [
      { "field": "price", "operator": "<", "value": 100 }
    ],
    "includes": [
      { "relation": "category" }
    ]
  }
}`,
      status: 200,
      statusText: 'OK',
      response: `{
  "current_page": 1,
  "data": [
    {
      "id": 1, "category_id": 1, "name": "Desk lamp", "price": 39,
      "category": { "id": 1, "name": "Lighting" }
    }
  ],
  "from": 1, "last_page": 1, "per_page": 50, "to": 1, "total": 1,
  "meta": {}
}`
    }]
  },
  {
    key: 'mutate',
    label: 'Mutate',
    icon: 'i-lucide-git-merge',
    file: 'app/Rest/Resources/CategoryResource.php',
    php: `class CategoryResource extends Resource
{
    public static string $model = Category::class;

    public function fields(): array
    {
        return [
            ID::make('id'),
            Text::make('name')->rules('max:255'),
        ];
    }

    public function relations(): array
    {
        return [
            HasMany::make('products', ProductResource::class),
        ];
    }
}`,
    wiring: { file: 'routes/api.php', code: `Rest::resource('categories', CategoriesController::class);` },
    caption: 'Create a category, create a product in it and move another one: one request, one transaction.',
    steps: [{
      method: 'POST',
      url: '/api/categories/mutate',
      request: `{
  "mutate": [{
    "operation": "create",
    "attributes": { "name": "Seating" },
    "relations": {
      "products": [
        { "operation": "create",
          "attributes": { "name": "Office chair", "price": 149 } },
        { "operation": "attach", "key": [2] }
      ]
    }
  }]
}`,
      status: 200,
      statusText: 'OK',
      response: `{
  "operations": [{
    "operation": "create",
    "key": 2,
    "relations": {
      "products": [
        { "operation": "create", "key": 3 },
        { "operation": "attach", "key": [2] }
      ]
    }
  }]
}`
    }]
  },
  {
    key: 'action',
    label: 'Action',
    icon: 'i-lucide-zap',
    file: 'app/Rest/Actions/ShredDocuments.php',
    php: `class ShredDocuments extends Action
{
    public function confirmation(
        ActionFields $fields,
        int $rows,
    ): ?ActionConfirmation {
        return ActionConfirmation::make("Shred {$rows} documents?")
            ->data(['rows' => $rows]);
    }

    public function handle(
        ActionFields $fields,
        Collection $models,
    ): void {
        $models->each->shred();
    }

    public function respond(
        ActionFields $fields,
        int $impacted,
    ): ?ActionResponse {
        return ActionResponse::message("{$impacted} documents shredded");
    }
}`,
    wiring: { file: 'DocumentResource::actions()', code: `return [ShredDocuments::make()];` },
    caption: 'The server asks first: a 428 with a signed token. The same body sent back with the token runs the action.',
    steps: [{
      method: 'POST',
      url: '/api/documents/actions/shred-documents',
      note: 'asks first',
      request: `{
  "search": {
    "filters": [
      { "field": "title", "operator": "!=", "value": "Budget" }
    ]
  }
}`,
      status: 428,
      statusText: 'Precondition Required',
      response: `{
  "message": "Shred 3 documents?",
  "confirmation": {
    "token": "1794132300.…",
    "expires_at": "2026-11-08T10:05:00Z",
    "data": { "rows": 3 }
  }
}`
    }, {
      method: 'POST',
      url: '/api/documents/actions/shred-documents',
      note: 'confirmed',
      request: `{
  "search": {
    "filters": [
      { "field": "title", "operator": "!=", "value": "Budget" }
    ]
  },
  "confirmation": "1794132300.…"
}`,
      status: 200,
      statusText: 'OK',
      response: `{
  "data": {
    "impacted": 3,
    "result": { "type": "message", "message": "3 documents shredded" }
  }
}`
    }]
  }
]

const CODE_SPEED = 300
const REQUEST_SPEED = 210

function keystrokes(code: string): number[] {
  const stops: number[] = []
  let index = 0

  while (index < code.length) {
    if (code[index] === '\n') {
      index++

      while (code[index] === ' ') {
        index++
      }
    } else {
      index++
    }

    stops.push(index)
  }

  return stops
}

interface StepTimes {
  requestStart: number
  requestEnd: number
  sendStart: number
  responseStart: number
  end: number
  stops: number[]
}

interface Timeline {
  codeStart: number
  codeEnd: number
  codeStops: number[]
  steps: StepTimes[]
  total: number
}

const timelines: Timeline[] = scenes.map((scene) => {
  const codeStops = keystrokes(scene.php)
  const codeStart = 200
  const codeEnd = codeStart + (codeStops.length / CODE_SPEED) * 1000
  let cursor = codeEnd + 400

  const steps = scene.steps.map((step, index) => {
    const stops = keystrokes(step.request)
    const requestStart = cursor
    const requestEnd = requestStart + (stops.length / REQUEST_SPEED) * 1000
    const sendStart = requestEnd + 250
    const responseStart = sendStart + 600
    const end = responseStart + (index === scene.steps.length - 1 ? 4600 : 2200)
    cursor = end

    return { requestStart, requestEnd, sendStart, responseStart, end, stops }
  })

  return { codeStart, codeEnd, codeStops, steps, total: cursor }
})

function typed(stops: number[], start: number, speed: number, time: number): number {
  if (time < start) {
    return 0
  }

  const count = Math.floor(((time - start) / 1000) * speed)

  return count >= stops.length ? Number.POSITIVE_INFINITY : (count > 0 ? stops[count - 1]! : 0)
}

const sceneIndex = ref(0)
const time = ref(Number.POSITIVE_INFINITY)
const live = ref(false)
const paused = ref(false)
const inView = ref(true)
const motion = ref(false)

const scene = computed(() => scenes[sceneIndex.value]!)
const timeline = computed(() => timelines[sceneIndex.value]!)

const codeChars = computed(() => typed(timeline.value.codeStops, timeline.value.codeStart, CODE_SPEED, time.value))
const codeTyping = computed(() => time.value < timeline.value.codeEnd + 400)

const pinnedStep = ref<number | null>(null)

const stepIndex = computed(() => {
  if (pinnedStep.value !== null) {
    return pinnedStep.value
  }

  let current = 0

  timeline.value.steps.forEach((step, index) => {
    if (time.value >= step.requestStart) {
      current = index
    }
  })

  return current
})

const step = computed(() => scene.value.steps[stepIndex.value]!)
const stepTimes = computed(() => timeline.value.steps[stepIndex.value]!)
const requestChars = computed(() => typed(stepTimes.value.stops, stepTimes.value.requestStart, REQUEST_SPEED, time.value))
const requestTyping = computed(() => time.value >= stepTimes.value.requestStart && time.value < stepTimes.value.sendStart)
const sending = computed(() => time.value >= stepTimes.value.sendStart && time.value < stepTimes.value.responseStart)
const responded = computed(() => time.value >= stepTimes.value.responseStart)
const progress = computed(() => Math.min(1, Math.max(0, time.value / timeline.value.total)))

const statusColor = computed(() => step.value.status >= 400 ? 'warning' : 'success')

const root = useTemplateRef<HTMLElement>('root')
let frame = 0
let last = 0
let observer: IntersectionObserver | undefined

function running(): boolean {
  return live.value && motion.value && !paused.value && inView.value && document.visibilityState === 'visible'
}

function tick(now: number) {
  const delta = Math.min(now - last, 100)
  last = now
  time.value += delta

  if (time.value >= timeline.value.total) {
    sceneIndex.value = (sceneIndex.value + 1) % scenes.length
    time.value = 0
  }

  frame = running() ? requestAnimationFrame(tick) : 0
}

function resume() {
  if (frame === 0 && running()) {
    last = performance.now()
    frame = requestAnimationFrame(tick)
  }
}

function stop() {
  cancelAnimationFrame(frame)
  frame = 0
}

function select(index: number) {
  sceneIndex.value = index
  pinnedStep.value = null
  time.value = motion.value ? 0 : Number.POSITIVE_INFINITY
  resume()
}

function showStep(index: number) {
  if (motion.value) {
    pinnedStep.value = null
    time.value = timeline.value.steps[index]!.requestStart
    resume()
  } else {
    pinnedStep.value = index
  }
}

function togglePause() {
  paused.value = !paused.value

  if (paused.value) {
    stop()
  } else {
    resume()
  }
}

function onVisibility() {
  if (document.visibilityState === 'visible') {
    resume()
  } else {
    stop()
  }
}

onMounted(() => {
  motion.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  live.value = true

  if (!motion.value) {
    return
  }

  time.value = timeline.value.steps[0]!.requestStart - 300

  observer = new IntersectionObserver(([entry]) => {
    inView.value = entry?.isIntersecting ?? true

    if (inView.value) {
      resume()
    } else {
      stop()
    }
  }, { threshold: 0.2 })

  if (root.value) {
    observer.observe(root.value)
  }

  document.addEventListener('visibilitychange', onVisibility)
  resume()
})

onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
  document.removeEventListener('visibilitychange', onVisibility)
})
</script>

<template>
  <div
    ref="root"
    class="lr-demo"
    :class="{ 'is-live': live }"
  >
    <div class="mb-4 flex flex-wrap items-center justify-center gap-3">
      <div
        class="inline-flex rounded-full border border-default bg-default/70 p-1 shadow-sm backdrop-blur dark:bg-neutral-950/60"
        role="tablist"
        aria-label="Examples"
      >
        <button
          v-for="(item, index) in scenes"
          :key="item.key"
          type="button"
          role="tab"
          :aria-selected="index === sceneIndex"
          class="relative flex items-center gap-1.5 overflow-hidden rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:px-4"
          :class="index === sceneIndex ? 'bg-primary/10 text-primary' : 'text-muted hover:text-highlighted'"
          @click="select(index)"
        >
          <UIcon
            :name="item.icon"
            class="size-4"
          />
          {{ item.label }}
          <span
            v-if="index === sceneIndex && motion"
            class="absolute inset-x-3 bottom-0.5 h-0.5 origin-left rounded-full bg-primary"
            :style="{ transform: `scaleX(${progress})` }"
            aria-hidden="true"
          />
        </button>
      </div>
      <UButton
        v-if="motion"
        :icon="paused ? 'i-lucide-play' : 'i-lucide-pause'"
        color="neutral"
        variant="ghost"
        size="sm"
        class="rounded-full"
        :aria-label="paused ? 'Play the examples' : 'Pause the examples'"
        @click="togglePause"
      />
    </div>

    <div class="grid gap-4 text-left lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
      <LandingWindow
        :title="scene.file"
        icon="i-vscode-icons-file-type-php3"
      >
        <div class="relative h-[300px] overflow-x-auto overflow-y-hidden py-3 text-[11px] leading-[1.65] sm:h-[400px] sm:text-xs lg:h-[543px]">
          <LandingCode
            :code="scene.php"
            lang="php"
            line-numbers
            :chars="codeChars"
            :caret="codeTyping"
          />
        </div>
        <div class="flex h-11 shrink-0 items-center gap-3 overflow-hidden border-t border-default bg-elevated/50 px-4 font-mono text-[11px]">
          <span class="shrink-0 text-dimmed">{{ scene.wiring.file }}</span>
          <LandingCode
            :code="scene.wiring.code"
            lang="php"
            class="min-w-0 truncate [&_.lc-line]:px-0"
          />
        </div>
      </LandingWindow>

      <LandingWindow>
        <template #title>
          <div class="flex min-w-0 items-center gap-2 font-mono text-xs">
            <UBadge
              :label="step.method"
              color="primary"
              variant="subtle"
              size="sm"
              class="font-mono"
            />
            <span class="truncate text-highlighted">{{ step.url }}</span>
          </div>
        </template>
        <template #actions>
          <template v-if="scene.steps.length > 1">
            <button
              v-for="(item, index) in scene.steps"
              :key="index"
              type="button"
              :title="item.note"
              :aria-label="`Step ${index + 1}: ${item.note}`"
              class="hidden rounded px-1.5 py-0.5 font-mono text-xs whitespace-nowrap transition-colors sm:inline"
              :class="index === stepIndex ? 'bg-elevated text-highlighted' : 'text-dimmed hover:text-highlighted'"
              :aria-pressed="index === stepIndex"
              @click="showStep(index)"
            >
              {{ item.status }}
            </button>
          </template>
          <span
            class="flex h-6 items-center gap-1 rounded-md px-2 text-xs font-medium transition-all duration-300"
            :class="sending ? 'scale-95 bg-primary text-inverted' : 'bg-primary/10 text-primary'"
            aria-hidden="true"
          >
            <UIcon
              :name="sending ? 'i-lucide-loader-circle' : 'i-lucide-send'"
              class="size-3.5"
              :class="{ 'animate-spin': sending }"
            />
            Send
          </span>
        </template>

        <div class="lr-demo-body flex flex-1 flex-col">
          <div class="h-[214px] overflow-x-auto overflow-y-hidden py-3 text-[11px] leading-[1.65] sm:h-[285px] sm:text-xs">
            <LandingCode
              :code="step.request"
              lang="json"
              :chars="requestChars"
              :caret="requestTyping"
            />
          </div>

          <div class="relative flex h-10 shrink-0 items-center gap-2 border-y border-default bg-elevated/50 px-4 text-xs">
            <span
              class="absolute inset-x-0 -top-px h-px origin-left bg-primary transition-transform ease-out"
              :class="sending ? 'scale-x-100 duration-500' : 'scale-x-0 duration-0'"
              aria-hidden="true"
            />
            <span class="font-medium text-muted">Response</span>
            <Transition
              enter-active-class="transition duration-300 ease-out"
              enter-from-class="opacity-0 scale-90"
              leave-active-class="transition duration-100"
              leave-to-class="opacity-0"
            >
              <UBadge
                v-if="responded"
                :key="`${sceneIndex}-${stepIndex}`"
                :color="statusColor"
                variant="subtle"
                size="sm"
                class="font-mono"
                :label="`${step.status} ${step.statusText}`"
              />
            </Transition>
            <span class="ml-auto font-mono text-dimmed">application/json</span>
          </div>

          <div class="h-[236px] overflow-x-auto overflow-y-hidden py-3 text-[11px] leading-[1.65] sm:h-[262px] sm:text-xs">
            <LandingCode
              :key="`${sceneIndex}-${stepIndex}`"
              :code="step.response"
              lang="json"
              :reveal="responded"
            />
          </div>
        </div>
      </LandingWindow>
    </div>

    <p
      class="mx-auto mt-4 min-h-[2.5rem] max-w-2xl text-center text-sm text-muted"
      aria-live="polite"
    >
      {{ scene.caption }}
    </p>
  </div>
</template>

<style scoped>
.lr-motion .lr-demo:not(.is-live) .lr-demo-body {
  visibility: hidden;
}
</style>
