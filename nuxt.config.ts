import { readdirSync } from 'node:fs'
import { docsRedirects, docsVersions, latestDocsVersion } from './shared/utils/versions'

const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://laravel-rest-api.lomkit.com').replace(/\/$/, '')

/** Page paths of the latest version, read from its content folder. */
function latestDocsPaths(): string[] {
  const files = readdirSync(`content/${latestDocsVersion.folder}`, { recursive: true, encoding: 'utf8' })

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, '').split(/[\\/]/).map(part => part.replace(/^\d+\./, '')).filter(part => part !== 'index').join('/'))
    .map(path => `${latestDocsVersion.prefix}/${path}`)
}

const redirects = docsRedirects(latestDocsPaths())

// A version root is a folder on GitHub Pages too (`/2.x` next to `/2.x/...`): write `2.x/index.html` as well as `2.x.html`.
for (const version of docsVersions.filter(version => version.prefix)) {
  redirects[`${version.prefix}/`] = version.firstPage
}

/** Static redirect page: GitHub Pages serves files only, no HTTP redirect. */
function redirectPage(to: string): string {
  const url = `${siteUrl}${to}`

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Redirecting to ${to}</title>`
    + `<link rel="canonical" href="${url}"><meta name="robots" content="noindex, follow">`
    + `<meta http-equiv="refresh" content="0; url=${to}"></head>`
    + `<body><a href="${to}">${url}</a></body></html>`
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
    '@nuxt/content',
    'nuxt-og-image',
    'nuxt-llms',
    'nuxt-gtag'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: siteUrl
  },

  content: {
    build: {
      markdown: {
        highlight: {
          langs: ['php', 'bash']
        },
        toc: {
          searchDepth: 1
        }
      }
    }
  },

  routeRules: {
    ...Object.fromEntries(Object.entries(redirects).map(([from, to]) => [from, { redirect: { to, statusCode: 301 } }])),
    ...Object.fromEntries(docsVersions.filter(version => version.prefix).map(version => [`${version.prefix}/**`, { robots: 'noindex, follow' }]))
  },

  experimental: { asyncContext: true },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/',
        ...docsVersions.map(version => version.firstPage),
        ...Object.keys(redirects)
      ],
      crawlLinks: true,
      // Avoid Github pages trailing slash bug
      autoSubfolderIndex: false
    },
    hooks: {
      'prerender:generate'(route) {
        const to = redirects[route.route]
        if (to) {
          route.contents = redirectPage(to)
        }
      }
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  icon: {
    clientBundle: {
      scan: true
    }
  },

  llms: {
    domain: 'https://laravel-rest-api.lomkit.com/',
    title: 'Laravel Rest Api - Lomkit',
    description: 'Laravel Rest Api fully integrates with Laravel and creates a powerful API without destructuring your codebase.',
    full: {
      title: 'Laravel Rest Api - Full Documentation',
      description: 'Complete documentation for Laravel Rest Api by Lomkit'
    },
    sections: [
      ...[
        ['Getting Started', 'getting-started'],
        ['Resources', 'resources'],
        ['Search', 'search'],
        ['Writing', 'writing'],
        ['Actions and Metrics', 'actions-and-metrics'],
        ['Authorization', 'authorization'],
        ['Digging Deeper', 'digging-deeper']
      ].map(([title, folder]) => ({
        title: `${title} (${latestDocsVersion.name})`,
        contentCollection: latestDocsVersion.collection,
        contentFilters: [
          { field: 'path', operator: 'LIKE' as const, value: `${latestDocsVersion.prefix}/${folder}%` }
        ]
      })),
      {
        title: 'Previous version: 2.x',
        description: 'Documentation of Laravel Rest Api 2.x, kept for existing applications. Use the sections above for the current version.',
        contentCollection: 'docs2x'
      }
    ]
  },

  sitemap: {
    zeroRuntime: true,
    exclude: [
      ...Object.keys(redirects),
      ...docsVersions.filter(version => version.prefix).map(version => `${version.prefix}/**`)
    ]
  }
})
