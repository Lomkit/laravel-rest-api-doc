import VueGtag, { trackRouter } from 'vue-gtag'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueGtag, {
        property: {
            id: useRuntimeConfig().NUXT_PUBLIC_GTAG_ID
        }
    })
    trackRouter(useRouter())
})