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
          key: 'ld-software',
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            'name': packageInfo.name,
            'alternateName': packageInfo.composerName,
            'description': packageInfo.description,
            'url': `${siteUrl}/`,
            'codeRepository': packageInfo.repository,
            'programmingLanguage': {
              '@type': 'ComputerLanguage',
              'name': 'PHP'
            },
            'runtimePlatform': `PHP ${packageInfo.php}+, Laravel ${packageInfo.laravel}+`,
            'softwareVersion': packageInfo.release,
            'license': packageInfo.license,
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
