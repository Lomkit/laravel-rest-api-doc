<script setup lang="ts">
import { guardCases, guardStages } from '~/data/landing/guards'

const active = ref(0)
const reached = ref(guardStages.length)
let timer: ReturnType<typeof setInterval> | undefined

const current = computed(() => guardCases[active.value]!)
const last = computed(() => current.value.stop === null ? guardStages.length : current.value.stop + 1)
const progress = computed(() => Math.min(reached.value, last.value))
const done = computed(() => progress.value >= last.value)

function state(index: number): 'passed' | 'stopped' | 'checking' | 'idle' {
  if (current.value.stop !== null && index > current.value.stop) {
    return 'idle'
  }

  if (index < progress.value) {
    return index === current.value.stop ? 'stopped' : 'passed'
  }

  return index === progress.value && !done.value ? 'checking' : 'idle'
}

function play(index: number) {
  active.value = index
  clearInterval(timer)

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reached.value = last.value

    return
  }

  reached.value = 0
  timer = setInterval(() => {
    reached.value++

    if (done.value) {
      clearInterval(timer)
    }
  }, 520)
}

function onVisible(visible: boolean) {
  if (visible) {
    play(active.value)
  }
}

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <section
    id="guards"
    class="relative scroll-mt-16 py-14 sm:py-20"
  >
    <UContainer>
      <LandingHeading
        eyebrow="Safe by default"
        icon="i-lucide-shield-check"
        title="Nothing is written until every check passes"
        text="Your Laravel policies and validation rules run on every request, in a fixed order, before anything is written. Pick a request and watch where it stops."
      />

      <LandingReveal
        class="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]"
        :delay="100"
        @visible="onVisible"
      >
        <div
          class="grid content-start gap-2 sm:grid-cols-2 lg:grid-cols-1"
          role="group"
          aria-label="Example requests"
        >
          <button
            v-for="(item, index) in guardCases"
            :key="item.label"
            type="button"
            class="lg-case"
            :class="{ 'is-current': index === active }"
            :aria-pressed="index === active"
            data-case
            @click="play(index)"
          >
            <span
              class="size-2 shrink-0 rounded-full"
              :class="item.stop === null ? 'bg-emerald-500' : 'bg-red-500'"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1 text-left">{{ item.label }}</span>
            <span
              class="shrink-0 rounded px-1.5 font-mono text-[11px] font-semibold"
              :class="statusTone(Number.parseInt(item.status))"
            >{{ item.status.slice(0, 3) }}</span>
          </button>
        </div>

        <div class="min-w-0">
          <ol
            class="lg-track"
            :style="{ '--pos': Math.min(progress, last - (current.stop === null ? 0 : 1)) }"
          >
            <li
              v-for="(stage, index) in guardStages"
              :key="stage.title"
              class="lg-stage"
              :class="`is-${state(index)}`"
            >
              <span class="lg-node">
                <UIcon
                  :name="state(index) === 'passed' ? 'i-lucide-check' : state(index) === 'stopped' ? 'i-lucide-x' : stage.icon"
                  class="size-4"
                />
              </span>
              <span class="min-w-0">
                <span class="block text-sm font-semibold text-highlighted">{{ stage.title }}</span>
                <span class="block text-xs text-muted">{{ stage.text }}</span>
              </span>
            </li>
            <span
              class="lg-packet"
              :class="{ 'is-stopped': done && current.stop !== null, 'is-through': done && current.stop === null }"
              aria-hidden="true"
            />
          </ol>

          <div class="mt-6 grid gap-4 grid-cols-1 xl:grid-cols-2">
            <LandingWindow>
              <template #title>
                <span class="flex min-w-0 items-center gap-2 font-mono text-xs">
                  <span class="rounded px-1.5 font-bold bg-orange-500/15 text-orange-700 dark:text-orange-300">POST</span>
                  <span class="truncate text-highlighted">/api/products/mutate</span>
                </span>
              </template>
              <div class="overflow-x-auto py-3 text-[11px] leading-[1.65] sm:text-xs">
                <LandingCode
                  :code="current.body"
                  lang="json"
                />
              </div>
            </LandingWindow>

            <LandingWindow>
              <template #title>
                <span class="flex items-center gap-2 font-mono text-xs">
                  <span class="text-muted">Response</span>
                  <span
                    v-if="done"
                    class="rounded px-1.5 font-semibold"
                    :class="statusTone(Number.parseInt(current.status))"
                  >{{ current.status }}</span>
                </span>
              </template>
              <div
                class="min-h-[7.5rem] overflow-x-auto py-3 text-[11px] leading-[1.65] sm:text-xs"
                aria-live="polite"
              >
                <LandingCode
                  :key="active"
                  :code="current.response"
                  lang="json"
                  :reveal="done"
                />
              </div>
            </LandingWindow>
          </div>

          <div class="mt-4 grid items-start grid-cols-1 gap-4 xl:grid-cols-2">
            <p class="text-sm text-pretty text-muted">
              <UIcon
                name="i-lucide-info"
                class="mr-1 inline size-4 align-[-3px] text-primary"
              />
              {{ current.why }}
            </p>
            <LandingWindow
              v-if="current.code"
              :title="current.code.file"
              icon="i-vscode-icons-file-type-php3"
              note="excerpt"
            >
              <div class="overflow-x-auto py-3 text-[11px] leading-[1.65] sm:text-xs">
                <LandingCode
                  :code="current.code.text"
                  lang="php"
                />
              </div>
            </LandingWindow>
          </div>
        </div>
      </LandingReveal>
    </UContainer>
  </section>
</template>

<style src="./landing-guards.css"></style>
