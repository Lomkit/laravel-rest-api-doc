<script setup lang="ts">
import { detailsHints, detailsRequest, detailsResponse, frontendPoints } from '~/data/landing/frontend'

const active = ref<string | null>(null)
const hint = computed(() => active.value ? detailsHints[active.value]! : null)
const highlight = computed(() => hint.value ? linesWith(detailsResponse, hint.value.needles) : [])
const operators = ['=', '!=', 'like', 'not like', 'ilike', 'not ilike', 'in', 'not in']

function bind(key: string) {
  return {
    'data-key': key,
    'class': ['lf-hint', { 'is-active': active.value === key }],
    'aria-pressed': active.value === key,
    'onMouseenter': () => (active.value = key),
    'onFocus': () => (active.value = key),
    'onClick': () => (active.value = key)
  }
}
</script>

<template>
  <section
    id="frontend"
    class="relative scroll-mt-16 py-14 sm:py-20"
  >
    <UContainer>
      <div class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-5">
          <LandingHeading
            eyebrow="For your frontend"
            icon="i-lucide-app-window"
            title="Your interface asks the API what it may do"
            text="The details endpoint describes a resource for the signed-in user: fields, operators, rules, page sizes, actions and permissions. Build lists and forms from it instead of copying your rules into JavaScript."
          />
          <LandingReveal
            as="ul"
            class="mt-8 space-y-4"
            :delay="80"
          >
            <li
              v-for="point in frontendPoints"
              :key="point.link"
              class="flex gap-3 text-sm text-toned"
            >
              <UIcon
                :name="point.icon"
                class="mt-0.5 size-4 shrink-0 text-primary"
              />
              <span>
                {{ point.text }}
                <ULink
                  :to="point.link"
                  class="font-medium text-highlighted underline decoration-primary/50 underline-offset-4 hover:decoration-primary"
                >Read more</ULink>
              </span>
            </li>
          </LandingReveal>
        </div>

        <LandingReveal
          class="grid min-w-0 gap-4 grid-cols-1 lg:col-span-7"
          :delay="120"
          @mouseleave="active = null"
        >
          <div class="lf-mock rounded-xl border border-default bg-default p-4 shadow-xl shadow-black/5 sm:p-5 dark:bg-neutral-950/80 dark:shadow-black/40">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <p class="text-sm font-semibold text-highlighted">
                Artworks
              </p>
              <div class="flex flex-wrap items-center gap-2 text-xs">
                <button
                  type="button"
                  v-bind="bind('filter')"
                >
                  <UIcon
                    name="i-lucide-filter"
                    class="size-3.5"
                  />
                  Title
                  <span class="lf-select">like</span>
                  <span class="text-muted">“lamp”</span>
                </button>
                <button
                  type="button"
                  v-bind="bind('limits')"
                >
                  Rows <span class="lf-select">25</span>
                </button>
              </div>
            </div>
            <div class="mt-4 overflow-hidden rounded-lg border border-default text-sm">
              <div class="flex items-center justify-between bg-elevated/60 px-3 py-2 text-xs font-semibold text-muted">
                <button
                  type="button"
                  v-bind="bind('sort')"
                >
                  Title
                  <UIcon
                    name="i-lucide-arrow-up-down"
                    class="size-3.5"
                  />
                </button>
                <span>Medium</span>
              </div>
              <div class="border-t border-default px-3 py-2 text-muted">
                The operators of the filter, from the details:
                <span class="mt-1.5 flex flex-wrap gap-1">
                  <span
                    v-for="operator in operators"
                    :key="operator"
                    class="rounded border border-default px-1.5 font-mono text-[11px] text-toned"
                  >{{ operator }}</span>
                </span>
              </div>
            </div>
            <div class="mt-4 grid gap-1.5 grid-cols-1">
              <button
                type="button"
                v-bind="bind('label')"
                class="justify-self-start"
              >
                Title <span class="text-red-600 dark:text-red-400">*</span>
              </button>
              <button
                type="button"
                v-bind="bind('rules')"
                class="lf-input"
              >
                <span class="text-muted">Required on creation</span>
                <span class="ml-auto font-mono text-[11px] text-muted">0 / 120</span>
              </button>
            </div>
            <p
              class="mt-4 min-h-[2.5rem] text-sm text-muted"
              aria-live="polite"
            >
              {{ hint ? hint.text : 'Point at a part of this screen to see the key of the details it comes from.' }}
            </p>
          </div>

          <LandingWindow>
            <template #title>
              <span class="flex min-w-0 items-center gap-2 font-mono text-xs">
                <span class="rounded px-1.5 font-bold bg-sky-500/15 text-sky-700 dark:text-sky-300">GET</span>
                <span class="truncate text-highlighted">{{ detailsRequest.slice(4) }}</span>
              </span>
            </template>
            <template #actions>
              <span class="rounded-full border border-default px-2 font-mono text-[10px] whitespace-nowrap text-muted">excerpt: title</span>
            </template>
            <div class="overflow-x-auto py-3 text-[11px] leading-[1.65] sm:text-xs">
              <LandingCode
                :code="detailsResponse"
                lang="json"
                :highlight="highlight"
              />
            </div>
          </LandingWindow>
        </LandingReveal>
      </div>
    </UContainer>
  </section>
</template>

<style scoped src="./landing-frontend.css"></style>
