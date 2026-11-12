import { execFileSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { packageInfo } from './shared/utils/package-info'
import { docsRedirects, docsVersions, latestDocsVersion, type DocsVersion } from './shared/utils/versions'

const siteUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://laravel-rest-api.lomkit.com').replace(/\/$/, '')

/** Page paths of a version, read from its content folder. */
function docsPaths(version: DocsVersion): string[] {
  const files = readdirSync(`content/${version.folder}`, { recursive: true, encoding: 'utf8' })

  return files
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, '').split(/[\\/]/).map(part => part.replace(/^\d+\./, '')).filter(part => part !== 'index').join('/'))
    .map(path => `${version.prefix}/${path}`)
}

/**
 * Date of the last commit of each content file, keyed by its absolute path.
 * Empty outside a git checkout and in a shallow clone, where every file
 * would get the date of the last commit.
 */
function contentCommitDates(): Map<string, string> {
  const dates = new Map<string, string>()
  const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], maxBuffer: 64 * 1024 * 1024 })

  try {
    if (git('rev-parse', '--is-shallow-repository').trim() !== 'false') {
      return dates
    }

    const root = git('rev-parse', '--show-toplevel').trim()
    let date = ''

    for (const line of git('log', '--format=%x00%cI', '--name-only', '--', 'content').split('\n')) {
      if (line.startsWith('\0')) {
        date = line.slice(1)
      } else if (line && !dates.has(resolve(root, line))) {
        dates.set(resolve(root, line), date)
      }
    }
  } catch {
    return new Map()
  }

  return dates
}

const commitDates = contentCommitDates()

const redirects = docsRedirects(docsPaths(latestDocsVersion))

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
        ...Object.keys(redirects),
        ...docsVersions.flatMap(version => docsPaths(version).map(path => `/raw${path}.md`))
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

  hooks: {
    // The date of the last commit of a page: its sitemap lastmod and the dateModified of its structured data.
    'content:file:afterParse'(ctx) {
      const date = commitDates.get(ctx.file.path)

      if (date && !ctx.content.updatedAt) {
        ctx.content.updatedAt = date
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
    domain: siteUrl,
    title: `${packageInfo.name} ${latestDocsVersion.name}`,
    description: `${packageInfo.description} It is for Laravel developers who build an API for a frontend, a mobile app or another service, and runs on PHP ${packageInfo.php}+ and Laravel ${packageInfo.laravel}+.`,
    full: {
      title: `${packageInfo.name} ${latestDocsVersion.name}: full documentation`,
      description: `Every page of the current version (${latestDocsVersion.name}) in one Markdown file. The 2.x pages are not included.`
    },
    sections: [
      {
        title: 'Using these docs with an AI assistant',
        description: [
          `These docs describe ${packageInfo.name} ${latestDocsVersion.name}, the current version (latest release ${packageInfo.release}). Write ${latestDocsVersion.name} code from them, not 2.x code.`,
          'Every page below is a Markdown copy of the site page. The package ships a Laravel Boost skill named `laravel-rest-api`.',
          `Assistants that support MCP can also read these docs through GitMCP: https://lomkit.gitmcp.io/laravel-rest-api-doc.`
        ].join(' '),
        links: [
          {
            title: 'Use with AI',
            href: `${siteUrl}/raw/digging-deeper/ai-skill.md`,
            description: 'The Laravel Boost skill, llms.txt, the Markdown copies, GitMCP and Context7.'
          }
        ]
      },
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
        description: `${packageInfo.name} 2.x has a different API. Its pages are left out of this file and of llms-full.txt: read them only for an application that stays on 2.x.`,
        links: [
          {
            title: `${packageInfo.name} 2.x documentation`,
            href: `${siteUrl}/2.x/getting-started/installation`
          }
        ]
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
