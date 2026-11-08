/**
 * Head tags shared by every page: a self canonical link, and the
 * SoftwareSourceCode structured data on the landing page.
 */
export function useSiteSeo() {
  const route = useRoute()
  const site = useSiteConfig()
  const siteUrl = site.url.replace(/\/$/, '')

  useHead({
    link: [
      { rel: 'canonical', href: () => `${siteUrl}${route.path}` }
    ],
    script: () => route.path === '/'
      ? [{
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            'name': 'Laravel Rest Api',
            'description': 'Laravel Rest Api fully integrates with Laravel and creates a powerful API without destructuring your codebase.',
            'url': `${siteUrl}/`,
            'codeRepository': 'https://github.com/Lomkit/laravel-rest-api',
            'programmingLanguage': 'PHP',
            'runtimePlatform': 'Laravel',
            'license': 'https://opensource.org/licenses/MIT',
            'author': {
              '@type': 'Organization',
              'name': 'Lomkit',
              'url': 'https://github.com/Lomkit'
            }
          })
        }]
      : []
  })
}
