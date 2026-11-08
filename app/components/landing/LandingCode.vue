<script setup lang="ts">
type Lang = 'php' | 'json' | 'bash' | 'text'

interface Token {
  text: string
  kind: string
}

interface Line {
  start: number
  tokens: (Token & { start: number })[]
}

const props = withDefaults(defineProps<{
  code: string
  lang?: Lang
  chars?: number
  caret?: boolean
  lineNumbers?: boolean
  reveal?: boolean
  highlight?: number[]
}>(), {
  lang: 'text',
  chars: Number.POSITIVE_INFINITY,
  caret: false,
  lineNumbers: false,
  reveal: undefined,
  highlight: () => []
})

const rules: Record<Lang, [RegExp, string][]> = {
  php: [
    [/\/\/[^\n]*|\/\*[\s\S]*?\*\//y, 'comment'],
    [/#\[[^\]\n]*\]/y, 'meta'],
    [/'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/y, 'string'],
    [/\$[A-Za-z_]\w*/y, 'variable'],
    [/\b\d+(?:\.\d+)?\b/y, 'number'],
    [/\b(?:true|false|null)\b/y, 'constant'],
    [/\b(?:namespace|use|class|extends|implements|public|protected|private|static|function|return|new|fn|readonly|final|abstract|if|else|foreach|as|self)\b/y, 'keyword'],
    [/\b(?:array|string|int|bool|void|mixed|float|iterable)\b/y, 'type'],
    [/[A-Za-z_]\w*(?=\s*\()/y, 'function'],
    [/\b[A-Z]\w*/y, 'class'],
    [/[A-Za-z_]\w*/y, 'plain'],
    [/\s+/y, 'plain'],
    [/[^\sA-Za-z0-9_]/y, 'punct']
  ],
  json: [
    [/"(?:[^"\\\n]|\\.)*"(?=\s*:)/y, 'key'],
    [/"(?:[^"\\\n]|\\.)*"/y, 'string'],
    [/-?\d+(?:\.\d+)?/y, 'number'],
    [/\b(?:true|false|null)\b/y, 'constant'],
    [/\s+/y, 'plain'],
    [/[^\s]/y, 'punct']
  ],
  bash: [
    [/#[^\n]*/y, 'comment'],
    [/^\$ |(?<=\n)\$ /y, 'prompt'],
    [/'[^'\n]*'|"[^"\n]*"/y, 'string'],
    [/--?[\w-]+(?:=\S+)?/y, 'keyword'],
    [/(?<=(?:^|\n)\$ )[\w.-]+/y, 'function'],
    [/\S+/y, 'plain'],
    [/\s+/y, 'plain']
  ],
  text: [
    [/[\s\S]+/y, 'plain']
  ]
}

function tokenize(code: string, lang: Lang): Token[] {
  const tokens: Token[] = []
  const list = rules[lang]
  let index = 0

  while (index < code.length) {
    let matched = false

    for (const [pattern, kind] of list) {
      pattern.lastIndex = index
      const match = pattern.exec(code)

      if (match && match[0].length > 0) {
        const previous = tokens[tokens.length - 1]

        if (previous && previous.kind === kind && (kind === 'plain' || kind === 'punct')) {
          previous.text += match[0]
        } else {
          tokens.push({ text: match[0], kind })
        }

        index += match[0].length
        matched = true
        break
      }
    }

    if (!matched) {
      tokens.push({ text: code.charAt(index), kind: 'plain' })
      index++
    }
  }

  return tokens
}

const lines = computed<Line[]>(() => {
  const result: Line[] = [{ start: 0, tokens: [] }]
  let offset = 0

  for (const token of tokenize(props.code, props.lang)) {
    const parts = token.text.split('\n')

    parts.forEach((part, index) => {
      if (index > 0) {
        offset++
        result.push({ start: offset, tokens: [] })
      }

      if (part.length > 0) {
        result[result.length - 1]!.tokens.push({ text: part, kind: token.kind, start: offset })
        offset += part.length
      }
    })
  }

  return result
})

const typing = computed(() => Number.isFinite(props.chars))

const visibleLines = computed(() => {
  const limit = props.chars

  return lines.value
    .map((line, index) => ({ ...line, index }))
    .filter(line => line.start <= limit || line.index === 0)
    .map(line => ({
      index: line.index,
      tokens: line.tokens
        .filter(token => token.start < limit)
        .map(token => ({ kind: token.kind, text: token.text.slice(0, Math.max(0, limit - token.start)) }))
    }))
})

const caretLine = computed(() => visibleLines.value.length - 1)
</script>

<template>
  <pre
    class="lc"
    :class="{ 'lc-reveal': reveal !== undefined, 'is-revealed': reveal === true }"
  ><code><span
    v-for="line in visibleLines"
    :key="line.index"
    class="lc-line"
    :class="{ 'is-highlighted': highlight.includes(line.index + 1) }"
    :style="{ '--i': line.index }"
  ><span
    v-if="lineNumbers"
    class="lc-gutter"
    aria-hidden="true"
  >{{ line.index + 1 }}</span><span
    v-for="(token, index) in line.tokens"
    :key="index"
    :class="`lc-${token.kind}`"
  >{{ token.text }}</span><span
    v-if="caret && typing && line.index === caretLine"
    class="lc-caret"
    aria-hidden="true"
  />{{ '\n' }}</span></code></pre>
</template>

<style>
.lc {
  --lc-plain: #383a42;
  --lc-punct: #6b7280;
  --lc-keyword: #a626a4;
  --lc-type: #0184bc;
  --lc-string: #50a14f;
  --lc-number: #986801;
  --lc-constant: #986801;
  --lc-key: #c2410c;
  --lc-class: #b45309;
  --lc-function: #4078f2;
  --lc-variable: #e45649;
  --lc-comment: #9ca3af;
  --lc-meta: #0184bc;
  --lc-gutter-color: #c0c4cc;
  margin: 0;
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace);
  font-variant-ligatures: none;
  tab-size: 4;
  color: var(--lc-plain);
  background: transparent;
  white-space: pre;
}

.dark .lc {
  --lc-plain: #d4d8e0;
  --lc-punct: #8b93a3;
  --lc-keyword: #c678dd;
  --lc-type: #56b6c2;
  --lc-string: #98c379;
  --lc-number: #d19a66;
  --lc-constant: #d19a66;
  --lc-key: #f0a070;
  --lc-class: #e5c07b;
  --lc-function: #61afef;
  --lc-variable: #e06c75;
  --lc-comment: #6b7280;
  --lc-meta: #56b6c2;
  --lc-gutter-color: #4b5563;
}

.lc-line {
  display: block;
  min-height: 1lh;
  padding-inline: 1rem;
  transition: background-color 0.3s ease;
}

.lc-line.is-highlighted {
  background: color-mix(in oklab, var(--ui-primary) 14%, transparent);
  box-shadow: inset 2px 0 0 var(--ui-primary);
}

.lc-gutter {
  display: inline-block;
  width: 1.5rem;
  margin-right: 0.75rem;
  text-align: right;
  color: var(--lc-gutter-color);
  user-select: none;
}

.lc-punct { color: var(--lc-punct); }
.lc-keyword { color: var(--lc-keyword); }
.lc-type { color: var(--lc-type); }
.lc-string { color: var(--lc-string); }
.lc-number { color: var(--lc-number); }
.lc-constant { color: var(--lc-constant); }
.lc-key { color: var(--lc-key); }
.lc-class { color: var(--lc-class); }
.lc-function { color: var(--lc-function); }
.lc-variable { color: var(--lc-variable); }
.lc-comment { color: var(--lc-comment); font-style: italic; }
.lc-meta { color: var(--lc-meta); }
.lc-prompt { color: var(--lc-comment); user-select: none; }

.lc-caret {
  display: inline-block;
  width: 2px;
  height: 1.1em;
  margin-left: 1px;
  vertical-align: text-bottom;
  background: var(--ui-primary);
  animation: lc-blink 1s steps(1) infinite;
}

@keyframes lc-blink {
  50% { opacity: 0; }
}

.lc-reveal .lc-line {
  opacity: 0;
  transform: translateY(4px);
}

.lc-reveal.is-revealed .lc-line {
  opacity: 1;
  transform: none;
  transition: opacity 0.35s ease, transform 0.35s ease;
  transition-delay: calc(var(--i) * 28ms);
}

@media (prefers-reduced-motion: reduce) {
  .lc-caret { animation: none; }

  .lc-reveal .lc-line,
  .lc-reveal.is-revealed .lc-line {
    transition: none;
    transform: none;
  }
}
</style>
