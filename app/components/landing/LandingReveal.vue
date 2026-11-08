<script setup lang="ts">
const props = withDefaults(defineProps<{
  as?: string
  delay?: number
  once?: boolean
}>(), {
  as: 'div',
  delay: 0,
  once: true
})

const emit = defineEmits<{
  visible: [value: boolean]
}>()

const root = useTemplateRef<HTMLElement>('root')
const visible = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  const element = root.value

  if (!element || typeof IntersectionObserver === 'undefined') {
    visible.value = true
    emit('visible', true)

    return
  }

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting === visible.value) {
        continue
      }

      if (!entry.isIntersecting && props.once) {
        continue
      }

      visible.value = entry.isIntersecting
      emit('visible', entry.isIntersecting)

      if (entry.isIntersecting && props.once) {
        observer?.disconnect()
      }
    }
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 })

  observer.observe(element)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <component
    :is="as"
    ref="root"
    class="lr-reveal"
    :class="{ 'is-visible': visible }"
    :style="delay ? { '--lr-delay': `${delay}ms` } : undefined"
  >
    <slot :visible="visible" />
  </component>
</template>

<style>
.lr-motion .lr-reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--lr-delay, 0ms);
}

.lr-motion .lr-reveal.is-visible {
  opacity: 1;
  transform: none;
}
</style>
