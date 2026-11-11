<script setup lang="ts">
const props = defineProps<{
  root: HTMLElement | null
  shown: number
  active: number | null
  pulse: string | null
}>()

const paths = ref<string[]>([])
const size = ref({ width: 0, height: 0 })
let observer: ResizeObserver | undefined

function wire(from: DOMRect, row: DOMRect, base: DOMRect): string {
  const x2 = row.left - base.left
  const y2 = row.top - base.top + row.height / 2

  if (row.left > from.right - 8) {
    const x1 = from.right - base.left
    const y1 = from.top - base.top + from.height / 2
    const dx = Math.max(16, (x2 - x1) * 0.6)

    return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`
  }

  const x1 = from.left - base.left + 14
  const y1 = from.bottom - base.top

  return `M ${x1} ${y1} L ${x1} ${y2 - 8} Q ${x1} ${y2}, ${x1 + 8} ${y2} L ${x2} ${y2}`
}

function measure() {
  const root = props.root
  const from = root?.querySelector('[data-wire-from]')

  if (!root || !from) {
    return
  }

  const base = root.getBoundingClientRect()
  const start = from.getBoundingClientRect()

  size.value = { width: base.width, height: base.height }
  paths.value = [...root.querySelectorAll('[data-wire-to]')].map(row => wire(start, row.getBoundingClientRect(), base))
}

onMounted(() => {
  nextTick(measure)
  document.fonts?.ready.then(measure)

  if (props.root && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(measure)
    observer.observe(props.root)
  }
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div
    v-if="paths.length"
    class="hs-wires"
    aria-hidden="true"
  >
    <svg
      :viewBox="`0 0 ${size.width} ${size.height}`"
      :width="size.width"
      :height="size.height"
    >
      <path
        v-for="(path, index) in paths"
        :key="index"
        :d="path"
        pathLength="1"
        class="hs-wire"
        :class="{ 'is-shown': index < shown, 'is-active': index === active }"
      />
    </svg>
    <span
      v-if="pulse !== null && active !== null && paths[active]"
      :key="pulse"
      class="hs-pulse"
      :style="{ offsetPath: `path('${paths[active]}')` }"
    />
  </div>
</template>
