export default defineAppConfig({
  ui: {
    primary: 'orange',
    gray: 'slate',
    footer: {
      bottom: {
        left: 'text-sm text-gray-500 dark:text-gray-400',
        wrapper: 'border-t border-gray-200 dark:border-gray-800'
      }
    }
  },
  seo: {
    siteName: 'Laravel Rest Api - Lomkit'
  },
  header: {
    logo: {
      alt: '',
      light: '/logo.svg',
      dark: '/logo.svg'
    },
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-mdi-github',
      'to': 'https://github.com/Lomkit/laravel-rest-api',
      'target': '_blank',
      'aria-label': 'Laravel Rest Api on Github'
    }]
  },
  footer: {
    credits: 'Copyright © ' + (new Date().getFullYear()),
    colorMode: false,
    links: [{
      'icon': 'i-mdi-github',
      'to': 'https://github.com/lomkit/laravel-rest-api',
      'target': '_blank',
      'aria-label': 'Laravel Rest Api on GitHub'
    }]
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/lomkit/laravel-rest-api-doc/edit/master/content',
      links: [{
        icon: 'i-heroicons-star',
        label: 'Star on GitHub',
        to: 'https://github.com/lomkit/laravel-rest-api',
        target: '_blank'
      }]
    }
  }
})
