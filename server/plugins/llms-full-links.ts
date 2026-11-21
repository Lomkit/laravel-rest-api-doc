type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

/**
 * Fixes the links of a minimark tree for a page served at `path`: drops their
 * `rel`, and gives a link to an anchor of the page the path of the page.
 */
function fixLinks(node: MinimarkNode, path: string): void {
  if (!Array.isArray(node)) {
    return
  }

  const [tag, props, ...children] = node
  if (tag === 'a') {
    delete props.rel

    if (typeof props.href === 'string' && props.href.startsWith('#')) {
      props.href = `${path}${props.href}`
    }
  }
  children.forEach(child => fixLinks(child, path))
}

/**
 * Nuxt Content gives external links `rel="nofollow"`, which the Markdown of
 * llms-full.txt would print after each link as `{rel="&#x22;nofollow&#x22;"}`.
 * The attribute means nothing in Markdown: drop it before the page is written.
 *
 * llms-full.txt also prefixes every link with the site URL, so a link to an
 * anchor of the same page, such as `#drafts`, would lead to the home page:
 * prefix it with the path of its page first.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('content:llms:generate:document', (_event, doc: { path?: string, body?: { value?: MinimarkNode[] } }) => {
    doc.body?.value?.forEach(node => fixLinks(node, doc.path ?? ''))
  })
})
