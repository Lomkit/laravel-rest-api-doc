import type { ContentNavigationItem } from '@nuxt/content'
import type { DocsVersion } from '#shared/utils/versions'

interface DocsPageFacts {
  path: string
  title: string
  description: string
  updatedAt?: string
}

function findSection(items: ContentNavigationItem[], path: string): ContentNavigationItem | undefined {
  for (const item of items) {
    if (item.children?.some(child => child.path === path)) {
      return item
    }

    const section = findSection(item.children ?? [], path)
    if (section) {
      return section
    }
  }

  return undefined
}

/**
 * Head tags of a documentation page: the link to its Markdown copy, and its
 * TechArticle and BreadcrumbList structured data.
 */
export function useDocsPageSeo(page: DocsPageFacts, version: DocsVersion) {
  const site = useSiteConfig()
  const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
  const siteUrl = site.url.replace(/\/$/, '')
  const url = `${siteUrl}${page.path}`

  const crumbs = [{ name: packageInfo.name, url: `${siteUrl}/` }]
  if (version.prefix) {
    crumbs.push({ name: version.name, url: `${siteUrl}${version.firstPage}` })
  }

  const section = findSection(navigation?.value ?? [], page.path)
  const sectionStart = section?.children?.[0]?.path
  if (section && sectionStart && sectionStart !== page.path) {
    crumbs.push({ name: section.title, url: `${siteUrl}${sectionStart}` })
  }
  crumbs.push({ name: page.title, url })

  useHead({
    link: [
      { rel: 'alternate', type: 'text/markdown', href: `/raw${page.path}.md` }
    ],
    script: [{
      key: 'ld-page',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'TechArticle',
            'headline': page.title,
            'description': page.description,
            'url': url,
            'inLanguage': 'en',
            'version': version.name,
            ...(page.updatedAt ? { dateModified: page.updatedAt } : {}),
            'isPartOf': {
              '@type': 'WebSite',
              'name': packageInfo.name,
              'url': `${siteUrl}/`
            },
            'about': {
              '@type': 'SoftwareSourceCode',
              'name': packageInfo.name,
              'codeRepository': packageInfo.repository,
              'programmingLanguage': 'PHP'
            },
            'author': {
              '@type': 'Organization',
              'name': 'Lomkit',
              'url': 'https://github.com/Lomkit'
            }
          },
          {
            '@type': 'BreadcrumbList',
            'itemListElement': crumbs.map((crumb, index) => ({
              '@type': 'ListItem',
              'position': index + 1,
              'name': crumb.name,
              'item': crumb.url
            }))
          }
        ]
      })
    }]
  })
}
