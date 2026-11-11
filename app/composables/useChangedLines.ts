/**
 * The 1-based numbers of the lines that a snippet gained since its previous
 * value, cleared after a moment: what a reader should look at after a click.
 */
export function useChangedLines(source: () => string, duration = 1600) {
  const changed = ref<number[]>([])
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(source, (next, previous) => {
    const before = new Map<string, number>()

    for (const line of previous.split('\n')) {
      before.set(line, (before.get(line) ?? 0) + 1)
    }

    changed.value = next.split('\n').flatMap((line, index) => {
      const left = before.get(line) ?? 0

      if (left > 0) {
        before.set(line, left - 1)

        return []
      }

      return [index + 1]
    })

    clearTimeout(timer)
    timer = setTimeout(() => (changed.value = []), duration)
  })

  onBeforeUnmount(() => clearTimeout(timer))

  return changed
}
