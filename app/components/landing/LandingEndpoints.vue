<script setup lang="ts">
import { endpointExamples } from '~/data/landing/endpoints'

const selected = ref(0)
const example = computed(() => endpointExamples[selected.value]!)
const tabs = useTemplateRef<HTMLButtonElement[]>('tabs')

function move(step: number) {
  selected.value = (selected.value + step + endpointExamples.length) % endpointExamples.length
  nextTick(() => tabs.value?.[selected.value]?.focus())
}
</script>

<template>
  <section
    id="endpoints"
    class="relative scroll-mt-16 py-14 sm:py-20"
  >
    <UContainer>
      <LandingHeading
        eyebrow="Beyond search"
        icon="i-lucide-route"
        title="Every resource gets the same endpoints"
        text="Write rows with their relations, run your own actions, compute metrics, describe the resource, delete rows, and restore them when the model uses soft deletes. Each one checks the same declarations and the same policies."
      />

      <LandingReveal
        class="mt-12 grid gap-6 grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)]"
        :delay="100"
      >
        <div
          class="le-tabs"
          role="tablist"
          aria-label="Endpoint examples"
          aria-orientation="vertical"
          @keydown.down.prevent="move(1)"
          @keydown.right.prevent="move(1)"
          @keydown.up.prevent="move(-1)"
          @keydown.left.prevent="move(-1)"
        >
          <button
            v-for="(item, index) in endpointExamples"
            :id="`endpoint-tab-${item.key}`"
            ref="tabs"
            :key="item.key"
            type="button"
            role="tab"
            class="le-tab"
            :class="{ 'is-current': index === selected }"
            :aria-selected="index === selected"
            :aria-controls="`endpoint-panel-${item.key}`"
            :tabindex="index === selected ? 0 : -1"
            @click="selected = index"
          >
            <UIcon
              :name="item.icon"
              class="size-4 shrink-0"
            />
            {{ item.label }}
          </button>
        </div>

        <div
          :id="`endpoint-panel-${example.key}`"
          role="tabpanel"
          :aria-labelledby="`endpoint-tab-${example.key}`"
          class="min-w-0"
        >
          <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div class="min-w-0 max-w-2xl">
              <h3 class="text-xl font-semibold text-highlighted">
                {{ example.title }}
              </h3>
              <p class="mt-1 text-sm text-pretty text-muted">
                {{ example.text }}
              </p>
            </div>
            <UButton
              :to="example.link"
              label="Read the docs"
              color="neutral"
              variant="link"
              trailing-icon="i-lucide-arrow-right"
              class="px-0"
            />
          </div>

          <div
            :key="example.key"
            class="le-grid mt-5 grid grid-cols-1 gap-4"
            :class="{ 'has-php': example.php }"
          >
            <LandingWindow
              v-if="example.php"
              :title="example.php.file"
              icon="i-vscode-icons-file-type-php3"
              :note="example.php.excerpt ? 'excerpt' : undefined"
              class="le-php"
            >
              <div class="overflow-x-auto py-3 text-[11px] leading-[1.65]">
                <LandingCode
                  :code="example.php.code"
                  lang="php"
                />
              </div>
            </LandingWindow>

            <div class="grid min-w-0 content-start grid-cols-1 gap-4">
              <LandingWindow>
                <template #title>
                  <span class="flex min-w-0 items-center gap-2 font-mono text-xs">
                    <span
                      class="rounded px-1.5 font-bold"
                      :class="methodTone[example.method]"
                    >{{ example.method }}</span>
                    <span class="truncate text-highlighted">{{ example.uri }}</span>
                  </span>
                </template>
                <div
                  v-if="example.body"
                  class="overflow-x-auto py-3 text-[11px] leading-[1.65]"
                >
                  <LandingCode
                    :code="example.body"
                    lang="json"
                  />
                </div>
                <p
                  v-else
                  class="px-4 py-3 font-mono text-xs text-muted"
                >
                  No body
                </p>
              </LandingWindow>

              <LandingWindow :note="example.note">
                <template #title>
                  <span class="flex items-center gap-2 font-mono text-xs">
                    <span class="text-muted">Response</span>
                    <span class="rounded px-1.5 font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">{{ example.status }}</span>
                  </span>
                </template>
                <div class="overflow-x-auto py-3 text-[11px] leading-[1.65]">
                  <LandingCode
                    :code="example.response"
                    lang="json"
                  />
                </div>
              </LandingWindow>
            </div>
          </div>
        </div>
      </LandingReveal>
    </UContainer>
  </section>
</template>

<style scoped src="./landing-endpoints.css"></style>
