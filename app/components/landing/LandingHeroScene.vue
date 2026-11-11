<script setup lang="ts">
import { heroDuration, heroRequests, heroResource, heroRoute, heroRoutes, heroTimes } from '~/data/landing/hero'

const root = useTemplateRef<HTMLElement>('root')
const { time, motion, live, paused, seek, togglePause } = useLandingTimeline(root, {
  duration: heroDuration,
  loopFrom: heroTimes.requests
})

const pinned = ref(0)
const stops = heroRequests.map(request => keystrokes(request.body))
const final = computed(() => !Number.isFinite(time.value))

const routeLineOn = computed(() => time.value >= heroTimes.routeLine)
const shown = computed(() => final.value
  ? heroRoutes.length
  : Math.min(heroRoutes.length, Math.max(0, Math.floor((time.value - heroTimes.routes) / heroTimes.routeGap) + 1)))

const current = computed(() => {
  if (final.value) {
    return pinned.value
  }

  return time.value < heroTimes.requests
    ? -1
    : Math.min(heroRequests.length - 1, Math.floor((time.value - heroTimes.requests) / heroTimes.request))
})

const local = computed(() => final.value
  ? Number.POSITIVE_INFINITY
  : time.value - heroTimes.requests - Math.max(0, current.value) * heroTimes.request)

const request = computed(() => heroRequests[Math.max(0, current.value)]!)
const started = computed(() => current.value >= 0)
const chars = computed(() => started.value
  ? typedChars(stops[current.value]!, local.value, stops[current.value]!.length / (heroTimes.type / 1000))
  : 0)
const sent = computed(() => started.value && local.value >= heroTimes.send)
const responded = computed(() => started.value && local.value >= heroTimes.respond)
const activeRoute = computed(() => sent.value ? request.value.route : null)
const highlight = computed(() => responded.value ? linesWith(heroResource, request.value.uses) : [])

const caption = computed(() => {
  if (!final.value && time.value < heroTimes.routes) {
    return 'A resource lists what clients may read and write: fields and relations.'
  }

  return started.value ? request.value.caption : 'One route line registers the endpoints of the resource.'
})

function select(index: number) {
  pinned.value = index
  seek(heroTimes.requests + index * heroTimes.request)
}
</script>

<template>
  <div
    ref="root"
    class="hs"
    :class="{ 'is-live': live, 'is-motion': motion }"
  >
    <div class="hs-grid">
      <LandingWindow
        title="app/Rest/Resources/ProductResource.php"
        icon="i-vscode-icons-file-type-php3"
        class="hs-code"
      >
        <template #actions>
          <span
            v-if="request.missing && responded"
            class="hs-missing bg-red-500/15 text-red-700 dark:text-red-300"
          >no field named {{ request.missing }}</span>
          <span
            v-else
            class="hs-excerpt"
          >excerpt</span>
        </template>
        <div class="hs-code-body">
          <LandingCode
            :code="heroResource"
            lang="php"
            :highlight="highlight"
          />
        </div>
        <div
          class="hs-route"
          :class="{ 'is-on': routeLineOn }"
          data-wire-from
        >
          <span class="hs-route-file">routes/api.php</span>
          <LandingCode
            :code="heroRoute"
            lang="php"
            class="hs-route-code"
          />
        </div>
      </LandingWindow>

      <div class="hs-routes">
        <p class="hs-routes-title">
          Routes it registers
        </p>
        <ul class="hs-route-list">
          <li
            v-for="(route, index) in heroRoutes"
            :key="route.endpoint"
            class="hs-row"
            :class="{ 'is-shown': index < shown, 'is-active': index === activeRoute }"
            :data-wire-to="index"
          >
            <span class="hs-row-inner">
              <span
                class="hs-method"
                :class="methodTone[route.method]"
              >{{ route.method }}</span>
              <span class="hs-uri">{{ route.uri }}</span>
              <span
                v-if="index === activeRoute && responded"
                class="hs-status"
                :class="statusTone(request.status)"
              >{{ request.status }}</span>
            </span>
          </li>
        </ul>
      </div>
    </div>

    <LandingHeroConsole
      :requests="heroRequests"
      :current="Math.max(0, current)"
      :route="heroRoutes[request.route]!"
      :chars="chars"
      :typing="started && !sent"
      :sent="sent"
      :responded="responded"
      :motion="motion"
      :paused="paused"
      @select="select"
      @toggle-pause="togglePause"
    />

    <LandingHeroWires
      :root="root"
      :shown="shown"
      :active="activeRoute"
      :pulse="sent && !responded ? `${current}-${request.route}` : null"
    />

    <p
      class="hs-caption"
      aria-live="polite"
    >
      {{ caption }}
    </p>
  </div>
</template>

<style src="./landing-hero-scene.css"></style>
