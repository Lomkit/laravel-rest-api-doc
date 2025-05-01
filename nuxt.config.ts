// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui-pro',
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

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true,
      // Avoid Github pages trailing slash bug
      autoSubfolderIndex: false
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
    provider: 'iconify'
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
      {
        title: 'Getting Started',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/getting-started%' }
        ]
      },
      {
        title: 'Endpoints',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/endpoints%' }
        ]
      },
      {
        title: 'Resources',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/resources%' }
        ]
      },
      {
        title: 'Digging Deeper',
        contentCollection: 'docs',
        contentFilters: [
          { field: 'path', operator: 'LIKE', value: '/digging-deeper%' }
        ]
      }
    ]
  }
})
