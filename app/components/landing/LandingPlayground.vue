<script setup lang="ts">
import { playgroundOptions, searchBody, searchResponse, updatePolicy } from '~/data/landing/playground'
import type { OptionKey } from '~/data/landing/playground'

const on = ref(new Set<OptionKey>(['cheap', 'include']))

const body = computed(() => searchBody(on.value))
const response = computed(() => searchResponse(on.value))
const bodyChanged = useChangedLines(() => body.value)
const responseChanged = useChangedLines(() => response.value)

function toggle(key: OptionKey) {
  const next = new Set(on.value)

  if (next.has(key)) {
    next.delete(key)
  } else {
    next.add(key)
  }

  on.value = next
}
</script>

<template>
  <section
    id="playground"
    class="relative scroll-mt-16 py-14 sm:py-20"
  >
    <UContainer>
      <LandingHeading
        eyebrow="Try a search"
        icon="i-lucide-search"
        title="Clients ask for exactly the rows they need"
        text="Filters, sorts, related rows and per-row permissions travel in one JSON body. Pick options below: the request changes, and so does the answer the package gives."
      />

      <LandingReveal
        class="mt-12 grid gap-6 grid-cols-1 lg:grid-cols-12"
        :delay="100"
      >
        <div class="grid min-w-0 content-start gap-5 lg:col-span-5">
          <div>
            <p
              id="playground-options"
              class="text-xs font-semibold tracking-wider text-muted uppercase"
            >
              Options
            </p>
            <div
              class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2"
              role="group"
              aria-labelledby="playground-options"
            >
              <button
                v-for="option in playgroundOptions"
                :key="option.key"
                type="button"
                class="lp-option"
                :class="{ 'is-on': on.has(option.key) }"
                :aria-pressed="on.has(option.key)"
                data-toggle
                @click="toggle(option.key)"
              >
                <span
                  class="lp-switch"
                  aria-hidden="true"
                />
                <span class="min-w-0 flex-1 text-left">
                  <span class="block text-sm font-medium text-highlighted">{{ option.label }}</span>
                  <span class="block font-mono text-xs text-muted">{{ option.part }}</span>
                </span>
              </button>
            </div>
          </div>

          <LandingWindow>
            <template #title>
              <span class="flex min-w-0 items-center gap-2 font-mono text-xs">
                <span class="rounded bg-orange-500/15 px-1.5 font-bold text-orange-700 dark:text-orange-300">POST</span>
                <span class="truncate text-highlighted">/api/products/search</span>
              </span>
            </template>
            <div class="lp-request overflow-x-auto py-3 text-[11px] leading-[1.65] sm:text-xs">
              <LandingCode
                :code="body"
                lang="json"
                :highlight="bodyChanged"
              />
            </div>
          </LandingWindow>
        </div>

        <div class="grid min-w-0 content-start gap-4 lg:col-span-7">
          <LandingWindow>
            <template #title>
              <span class="flex items-center gap-2 font-mono text-xs">
                <span class="text-muted">Response</span>
                <span class="rounded bg-emerald-500/15 px-1.5 font-semibold text-emerald-700 dark:text-emerald-300">200 OK</span>
              </span>
            </template>
            <template #actions>
              <span class="rounded-full border border-default px-2 font-mono text-[10px] text-muted">example data</span>
            </template>
            <div
              class="lp-response overflow-x-auto py-3 text-[11px] leading-[1.65] sm:text-xs"
              aria-live="polite"
            >
              <LandingCode
                :code="response"
                lang="json"
                :highlight="responseChanged"
              />
            </div>
          </LandingWindow>

          <div class="rounded-xl border border-dashed border-default p-4 text-sm text-muted">
            <p v-if="!on.has('gates')">
              Four products in two categories. Without a sort, rows come by key, highest first.
              A page holds 50 rows unless the request sends a <code>limit</code> the resource allows.
            </p>
            <template v-else>
              <p class="mb-3">
                Each answer comes from your policy, row by row:
              </p>
              <div class="overflow-x-auto rounded-lg bg-elevated/60 py-2 text-[11px] leading-relaxed">
                <LandingCode
                  :code="updatePolicy"
                  lang="php"
                />
              </div>
            </template>
          </div>
        </div>
      </LandingReveal>
    </UContainer>
  </section>
</template>

<style scoped>
.lp-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid var(--ui-border);
  border-radius: 0.75rem;
  background: var(--ui-bg);
  padding: 0.625rem 0.875rem;
  transition: border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease;
}

.lp-option:hover { border-color: var(--ui-border-accented); }
.lp-option:focus-visible { outline: 2px solid var(--ui-primary); outline-offset: 2px; }

.lp-option.is-on {
  border-color: color-mix(in oklab, var(--ui-primary) 55%, transparent);
  background: color-mix(in oklab, var(--ui-primary) 7%, var(--ui-bg));
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--ui-primary) 12%, transparent);
}

.lp-switch {
  position: relative;
  width: 2rem;
  height: 1.125rem;
  flex-shrink: 0;
  border-radius: 9999px;
  background: var(--ui-bg-accented);
  transition: background-color 0.2s ease;
}

.lp-switch::after {
  content: '';
  position: absolute;
  top: 0.1875rem;
  left: 0.1875rem;
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  background: var(--ui-bg);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.is-on .lp-switch { background: var(--ui-primary); }
.is-on .lp-switch::after { transform: translateX(0.875rem); }

.lp-request { min-height: 15.5rem; }
.lp-response { min-height: 26rem; }

@media (prefers-reduced-motion: reduce) {
  .lp-switch::after { transition: none; }
}
</style>
