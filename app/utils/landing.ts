/**
 * Character offsets after each keystroke of a snippet: the indentation that
 * follows a line break is typed in one go, as an editor would insert it.
 */
export function keystrokes(code: string): number[] {
  const stops: number[] = []
  let index = 0

  while (index < code.length) {
    index++

    if (code[index - 1] === '\n') {
      while (code[index] === ' ') {
        index++
      }
    }

    stops.push(index)
  }

  return stops
}

/** Characters of a snippet typed at `elapsed` milliseconds, at `speed` keystrokes per second. */
export function typedChars(stops: number[], elapsed: number, speed: number): number {
  if (elapsed <= 0) {
    return 0
  }

  const count = Math.floor((elapsed / 1000) * speed)

  return count >= stops.length ? Number.POSITIVE_INFINITY : (count > 0 ? stops[count - 1]! : 0)
}

/** 1-based numbers of the lines of `code` that contain one of `needles`. */
export function linesWith(code: string, needles: string[]): number[] {
  return code.split('\n').flatMap((line, index) => needles.some(needle => line.includes(needle)) ? [index + 1] : [])
}

/** Colour classes of an HTTP method badge. */
export const methodTone: Record<string, string> = {
  GET: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
  POST: 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  DELETE: 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
}

/** Colour classes of a status badge: success below 400, error otherwise. */
export function statusTone(status: number): string {
  return status >= 400
    ? 'bg-red-500/15 text-red-700 dark:text-red-300'
    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
}
