import type { ContentNavigationItem } from '@nuxt/content'
import type { DocsVersion } from '#shared/utils/versions'

export type DocsNavigations = Record<string, ContentNavigationItem[]>

function flattenNavigation(items: ContentNavigationItem[]): string[] {
  return items.flatMap(item => [item.path, ...flattenNavigation(item.children ?? [])])
}

/** Version of the current route; the latest one outside the docs. */
export function useDocsVersion() {
  const route = useRoute()

  return computed(() => findDocsVersion(route.path))
}

/**
 * Loads the navigation of every version and the search sections, and provides
 * the navigation of the current version to the layout and the header.
 * The provides run before the await: they need the component instance.
 */
export async function useDocsNavigation() {
  const version = useDocsVersion()

  const navigationRequest = useAsyncData('navigation', async () => {
    const entries = await Promise.all(docsVersions.map(async (docsVersion) => {
      const tree = await queryCollectionNavigation(docsVersion.collection)
      const root = docsVersion.prefix ? tree.find(item => item.path === docsVersion.prefix) : undefined

      return [docsVersion.name, root?.children ?? tree] as const
    }))

    return Object.fromEntries(entries) as DocsNavigations
  })

  const navigations = navigationRequest.data

  const { data: sections } = useLazyAsyncData('search', async () => {
    const entries = await Promise.all(docsVersions.map(async docsVersion =>
      [docsVersion.name, await queryCollectionSearchSections(docsVersion.collection)] as const
    ))

    return Object.fromEntries(entries)
  }, {
    server: false
  })

  const navigation = computed(() => navigations.value?.[version.value.name] ?? [])
  const files = computed(() => sections.value?.[version.value.name])

  provide('navigation', navigation)
  provide('docsNavigations', navigations)

  await navigationRequest

  return { navigation, files }
}

/** Resolves the page equivalent to the current one in another version. */
export function useDocsEquivalent() {
  const route = useRoute()
  const navigations = inject<Ref<DocsNavigations | undefined>>('docsNavigations')

  return (target: DocsVersion) => equivalentDocsPath(
    route.path,
    target,
    flattenNavigation(navigations?.value?.[target.name] ?? [])
  )
}
