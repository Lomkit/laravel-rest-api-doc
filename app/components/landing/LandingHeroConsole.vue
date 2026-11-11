<script setup lang="ts">
import type { HeroRequest, HeroRoute } from '~/data/landing/hero'

const props = defineProps<{
  requests: HeroRequest[]
  current: number
  route: HeroRoute
  chars: number
  typing: boolean
  sent: boolean
  responded: boolean
  motion: boolean
  paused: boolean
}>()

defineEmits<{
  'select': [index: number]
  'toggle-pause': []
}>()

const request = computed(() => props.requests[props.current]!)
</script>

<template>
  <LandingWindow class="hs-console">
    <template #title>
      <div
        class="hs-tabs"
        role="tablist"
        aria-label="Example requests"
      >
        <button
          v-for="(item, index) in requests"
          :key="item.label"
          type="button"
          role="tab"
          class="hs-tab"
          :class="{ 'is-current': index === current }"
          :aria-selected="index === current"
          @click="$emit('select', index)"
        >
          <span
            class="hs-tab-dot"
            :class="item.status >= 400 ? 'is-error' : 'is-ok'"
            aria-hidden="true"
          />
          {{ item.label }}
        </button>
      </div>
    </template>
    <template #actions>
      <UButton
        v-if="motion"
        :icon="paused ? 'i-lucide-play' : 'i-lucide-pause'"
        color="neutral"
        variant="ghost"
        size="xs"
        :aria-label="paused ? 'Play the example requests' : 'Pause the example requests'"
        @click="$emit('toggle-pause')"
      />
    </template>

    <div class="hs-panes">
      <div class="hs-pane">
        <p class="hs-pane-head">
          <span
            class="hs-pane-method"
            :class="methodTone[route.method]"
          >{{ route.method }}</span>
          <span class="hs-pane-uri">{{ route.uri }}</span>
          <span
            class="hs-send"
            :class="{ 'is-sending': sent && !responded }"
            aria-hidden="true"
          >
            <UIcon
              name="i-lucide-send"
              class="size-3"
            />
          </span>
        </p>
        <div class="hs-pane-code">
          <LandingCode
            :code="request.body"
            lang="json"
            :chars="chars"
            :caret="typing"
          />
        </div>
      </div>
      <div class="hs-pane hs-pane-response">
        <p class="hs-pane-head">
          <span class="text-muted">Response</span>
          <span
            v-if="responded"
            :key="`${current}`"
            class="hs-badge"
            :class="statusTone(request.status)"
          >{{ request.status }} {{ request.statusText }}</span>
        </p>
        <div class="hs-pane-code">
          <LandingCode
            :key="`r-${current}`"
            :code="request.response"
            lang="json"
            :reveal="responded"
          />
        </div>
      </div>
    </div>
  </LandingWindow>
</template>
