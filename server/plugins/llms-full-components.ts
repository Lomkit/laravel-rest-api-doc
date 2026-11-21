type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

/** Callout components, written as a quote that opens with their label. */
const callouts: Record<string, string> = {
  note: 'Note',
  tip: 'Tip',
  warning: 'Warning',
  caution: 'Caution',
  important: 'Important'
}

/**
 * Layout components, replaced by their content, with the prop that titles
 * them, if any, written as a bold line before it.
 */
const wrappers: Record<string, string | null> = {
  'code-group': null,
  'collapsible': 'name',
  'steps': null,
  'tabs': null,
  'tabs-item': 'label'
}

function callout(label: string, content: MinimarkNode[]): MinimarkNode {
  const lead: MinimarkNode = ['strong', {}, `${label}:`]
  const [first, ...rest] = content

  if (Array.isArray(first) && first[0] === 'p') {
    const [, props, ...inline] = first

    return ['blockquote', {}, ['p', props, lead, ' ', ...inline], ...rest]
  }

  return ['blockquote', {}, ['p', {}, lead], ...content]
}

/** The nodes of a minimark tree with their MDC components turned into plain Markdown. */
function plainMarkdown(nodes: MinimarkNode[]): MinimarkNode[] {
  return nodes.flatMap((node): MinimarkNode[] => {
    if (!Array.isArray(node)) {
      return [node]
    }

    const [tag, props, ...children] = node
    const content = plainMarkdown(children)

    if (tag in wrappers) {
      const titleProp = wrappers[tag]
      const title = titleProp ? props[titleProp] : undefined

      return typeof title === 'string' && title
        ? [['p', {}, ['strong', {}, title.charAt(0).toUpperCase() + title.slice(1)]], ...content]
        : content
    }

    const label = callouts[tag]

    return [label ? callout(label, content) : [tag, props, ...content]]
  })
}

/**
 * The pages of llms-full.txt would keep their MDC syntax, such as `::note` or
 * `::code-group`, which means nothing to a Markdown reader: write callouts as
 * quotes and replace the layout components with their title and content.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', (_event, doc: { body?: { value?: MinimarkNode[] } }) => {
    if (doc.body?.value) {
      doc.body.value = plainMarkdown(doc.body.value)
    }
  })
})
