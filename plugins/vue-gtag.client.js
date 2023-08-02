import VueGtag, { trackRouter } from 'vue-gtag'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(VueGtag, {
        config: {
            id: 'G-3NTHH4D2GH'
        }
    }, useRouter())
})