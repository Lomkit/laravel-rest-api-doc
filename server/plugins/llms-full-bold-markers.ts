/**
 * The Markdown writer of llms-full.txt (mdast-util-to-markdown 2.1.2, through
 * @nuxtjs/mdc 0.23) prints the first marker of a bold phrase that ends with a
 * period as `&#x2A;`, as in `&#x2A;*Read the clock.**`. Give those phrases
 * back their `**`. Remove this plugin once the writer prints `**` itself.
 */
export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('beforeResponse', (event, response) => {
    if (event.path === '/llms-full.txt' && typeof response.body === 'string') {
      response.body = response.body.replaceAll('&#x2A;*', '**')
    }
  })
})
