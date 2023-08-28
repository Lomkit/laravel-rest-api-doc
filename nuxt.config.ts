const path = require('path');

export default defineNuxtConfig({
  // https://github.com/nuxt-themes/docus
  extends: '@nuxt-themes/docus',

  modules: [
    // https://github.com/nuxt-modules/plausible
    '@nuxtjs/plausible',
    // https://github.com/nuxt/devtools
    '@nuxt/devtools',
    // https://nuxt.studio/docs/projects/setup#requirements-to-use-the-studio-editor
    '@nuxthq/studio',
    // https://nuxt.com/modules/robots
    '@nuxtjs/robots',
    // https://www.npmjs.com/package/@funken-studio/sitemap-nuxt-3 -- TODO: replace with official when nuxt3 support released
    ['@funken-studio/sitemap-nuxt-3', { generateOnBuild: true }]
  ],

  publicRuntimeConfig: {
    NUXT_PUBLIC_STUDIO_TOKENS: process.env.NUXT_PUBLIC_STUDIO_TOKENS
  },

  robots: {
    //
  },

  sitemap: {
    hostname: 'https://laravel-rest-api.lomkit.com'
  }
})
