import VueGtag, { trackRouter } from 'vue-gtag'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueGtag, {
        config: {
            id: useRuntimeConfig().NUXT_PUBLIC_GTAG_ID
        }
    }, useRouter())
})