import type { Ref } from 'vue'

interface TimelineOptions {
  /** Length of the timeline in milliseconds. */
  duration: number
  /** Time to jump back to at the end; the timeline stops at its end without it. */
  loopFrom?: number
}

/**
 * A clock in milliseconds that runs only while its element is on screen, the
 * tab is visible and the user accepts motion. Without motion, or before the
 * page hydrates, the time is infinite: every scene renders its final state.
 */
export function useLandingTimeline(root: Readonly<Ref<HTMLElement | null>>, options: TimelineOptions) {
  const time = ref(Number.POSITIVE_INFINITY)
  const motion = ref(false)
  const live = ref(false)
  const paused = ref(false)
  const inView = ref(false)

  let frame = 0
  let last = 0
  let observer: IntersectionObserver | undefined

  const running = () => motion.value && !paused.value && inView.value && document.visibilityState === 'visible'

  function tick(now: number) {
    time.value += Math.min(now - last, 100)
    last = now

    if (time.value >= options.duration) {
      if (options.loopFrom === undefined) {
        time.value = options.duration
        frame = 0

        return
      }

      time.value = options.loopFrom
    }

    frame = running() ? requestAnimationFrame(tick) : 0
  }

  function resume() {
    if (frame === 0 && running() && time.value < options.duration) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
  }

  function stop() {
    cancelAnimationFrame(frame)
    frame = 0
  }

  function seek(at: number) {
    time.value = motion.value ? at : Number.POSITIVE_INFINITY
    resume()
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
    live.value = true
    motion.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!motion.value || !root.value) {
      return
    }

    time.value = 0
    observer = new IntersectionObserver(([entry]) => {
      inView.value = entry?.isIntersecting ?? false

      if (inView.value) {
        resume()
      } else {
        stop()
      }
    }, { threshold: 0.25 })
    observer.observe(root.value)
    document.addEventListener('visibilitychange', onVisibility)
  })

  onBeforeUnmount(() => {
    stop()
    observer?.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
  })

  return { time, motion, live, paused, seek, togglePause }
}
