import { defineContentConfig, defineCollection, z } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { docsVersions, latestDocsVersion, type DocsVersion } from './shared/utils/versions'

const docsSchema = z.object({
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    to: z.string(),
    target: z.string().optional()
  })).optional()
})

/**
 * Pages of one documentation version: `content/<folder>/**` served under the
 * version prefix (the root for the latest one, the only one in the sitemap).
 */
function docsCollection(name: DocsVersion['collection']) {
  const version = docsVersions.find(docsVersion => docsVersion.collection === name)!
  const collection = {
    type: 'page' as const,
    source: {
      include: `${version.folder}/**`,
      prefix: version.prefix || '/'
    },
    schema: docsSchema
  }

  return defineCollection(version === latestDocsVersion ? asSitemapCollection(collection) : collection)
}

export default defineContentConfig({
  collections: {
    landing: defineCollection({
      type: 'page',
      source: 'index.md'
    }),
    docs3x: docsCollection('docs3x'),
    docs2x: docsCollection('docs2x')
  }
})
