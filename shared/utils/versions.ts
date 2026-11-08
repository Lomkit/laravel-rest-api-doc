/**
 * Documentation versions, latest first. The latest version is served at the
 * root, older ones under their own prefix. Releasing a new major is a change
 * here and in content.config.ts: add it first with an empty `prefix`, give
 * the previous one its prefix.
 */
export interface DocsVersion {
  /** Label shown in the switcher. */
  name: string
  /** Name of the Nuxt Content collection holding the pages of this version. */
  collection: 'docs3x' | 'docs2x'
  /** Folder of the pages under `content/`. */
  folder: string
  /** URL prefix of the pages, empty for the latest version. */
  prefix: string
  /** First page of the version: target of the switcher when no equivalent page exists. */
  firstPage: string
}

export const docsVersions: DocsVersion[] = [
  { name: '3.x', collection: 'docs3x', folder: '3.x', prefix: '', firstPage: '/getting-started/introduction' },
  { name: '2.x', collection: 'docs2x', folder: '2.x', prefix: '/2.x', firstPage: '/2.x/getting-started/installation' }
]

export const latestDocsVersion = docsVersions[0]!

/**
 * Equivalent latest page of every 2.x page, both without their version prefix.
 * Used by the version switcher (both ways) and by the redirects of the 2.x URLs
 * that were served at the root before the latest version took it.
 */
export const docsEquivalents: Record<string, string> = {
  '/getting-started/installation': '/getting-started/installation',
  '/getting-started/upgrade-guide': '/getting-started/upgrade-guide',
  '/endpoints/details': '/digging-deeper/details',
  '/endpoints/search': '/search/overview',
  '/endpoints/mutate': '/writing/mutate',
  '/endpoints/actions': '/actions-and-metrics/actions',
  '/endpoints/delete': '/writing/deleting',
  '/resources/basics': '/resources/resources',
  '/resources/exposed-data': '/resources/fields',
  '/resources/relationships': '/resources/relations',
  '/resources/validations': '/resources/validation',
  '/resources/interactions': '/resources/perimeter',
  '/digging-deeper/actions': '/actions-and-metrics/actions',
  '/digging-deeper/hooks': '/digging-deeper/events-and-hooks',
  '/digging-deeper/gates': '/authorization/gates',
  '/digging-deeper/authorizations': '/authorization/policies',
  '/digging-deeper/full-text-search': '/search/text-search',
  '/digging-deeper/instructions': '/search/scopes-and-instructions',
  '/digging-deeper/responses': '/digging-deeper/responses',
  '/digging-deeper/documentation': '/digging-deeper/openapi',
  '/digging-deeper/precognition': '/digging-deeper/precognition',
  '/integrations/flutter': '/2.x/integrations/flutter'
}

export function findDocsVersion(path: string): DocsVersion {
  return docsVersions.find(version => version.prefix && (path === version.prefix || path.startsWith(`${version.prefix}/`)))
    ?? latestDocsVersion
}

/**
 * Redirects: older version roots to their first page, and every old root URL
 * whose page no longer exists in the latest version to its equivalent.
 * `latestPaths` lists the page paths of the latest version.
 */
export function docsRedirects(latestPaths: string[]): Record<string, string> {
  const redirects: Record<string, string> = {}

  for (const version of docsVersions.filter(version => version.prefix)) {
    redirects[version.prefix] = version.firstPage
  }

  for (const [from, to] of Object.entries(docsEquivalents)) {
    if (!latestPaths.includes(from)) {
      redirects[from] = to
    }
  }

  return redirects
}

/**
 * Path of the page equivalent to `path` in `target`, among `existing` paths of
 * that version; the target first page when there is none.
 */
export function equivalentDocsPath(path: string, target: DocsVersion, existing: string[]): string {
  const current = findDocsVersion(path)
  const slug = path.slice(current.prefix.length) || '/'
  const candidates: string[] = []

  if (current.name === target.name) {
    candidates.push(slug)
  } else if (target.name === latestDocsVersion.name) {
    candidates.push(docsEquivalents[slug] ?? slug, slug)
  } else {
    candidates.push(...Object.keys(docsEquivalents).filter(from => docsEquivalents[from] === slug), slug)
  }

  const match = candidates.map(candidate => `${target.prefix}${candidate}`).find(candidate => existing.includes(candidate))

  return match ?? target.firstPage
}
