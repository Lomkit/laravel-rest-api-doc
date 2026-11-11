/** The feature tiles, each pointing at the page that documents it. */
export interface ToolboxTile {
  icon: string
  title: string
  text: string
  link: string
  code?: { lang: 'bash' | 'json' | 'php' | 'text', text: string, excerpt?: boolean }
  wide?: boolean
}

export const toolboxTiles: ToolboxTile[] = [
  {
    icon: 'i-lucide-rocket',
    title: 'Start from your models',
    text: 'rest:quick-start writes a resource, a controller and a route for each model you pick, and a policy when it has none, then checks the result in a fresh process.',
    link: '/getting-started/quick-start',
    wide: true,
    code: { lang: 'text', text: `$ php artisan rest:quick-start
  checks (fresh process) ... 6 routes authenticated, 1 policy found
  Next:
    php artisan tinker --execute="echo App\\Models\\User::first()->createToken('cli')->plainTextToken;"
    curl -X POST http://localhost/api/products/search -H "Authorization: Bearer <token>" …
  ProductPolicy lets signed-in users do everything. Edit app/Policies before production.`, excerpt: true }
  },
  {
    icon: 'i-lucide-hand',
    title: 'Confirm before it runs',
    text: 'An action or a write can answer 428 with a signed token, and run only when the same request comes back with it.',
    link: '/actions-and-metrics/confirmation',
    wide: true,
    code: { lang: 'json', text: `{
  "message": "Shred 4 documents?",
  "confirmation": {
    "token": "1794132300.f701…",
    "expires_at": "2026-11-08T10:05:00Z",
    "data": {"rows": 4}
  }
}`, excerpt: true }
  },
  {
    icon: 'i-lucide-layers',
    title: 'Queued and batched actions',
    text: 'Heavy actions run in jobs, as the user who sent them, and clients follow the batch progress.',
    link: '/actions-and-metrics/queued-actions'
  },
  {
    icon: 'i-lucide-file-down',
    title: 'Exports',
    text: 'A queued, batched action writes the rows of a search to a CSV file, in the columns the client picks.',
    link: '/actions-and-metrics/exports'
  },
  {
    icon: 'i-lucide-text-search',
    title: 'Text search and search engines',
    text: 'LIKE, full-text indexes, or Meilisearch, Typesense and Algolia through Laravel Scout.',
    link: '/search/text-search'
  },
  {
    icon: 'i-lucide-git-compare',
    title: 'Versioned rows',
    text: 'Two users edit the same row: the second save gets a 409 instead of overwriting the first.',
    link: '/writing/versioned-rows'
  },
  {
    icon: 'i-lucide-scan',
    title: 'A perimeter per user',
    text: 'perimeterQuery() decides which rows exist for each client, on every endpoint and at every level.',
    link: '/resources/perimeter'
  },
  {
    icon: 'i-lucide-ruler',
    title: 'Bounded requests',
    text: 'Page sizes, nesting depths, list sizes and rendered rows are capped, so one request cannot ask for unbounded work.',
    link: '/resources/limits'
  },
  {
    icon: 'i-lucide-webhook',
    title: 'Events and hooks',
    text: 'Run your code around each endpoint and each row, and listen to the Laravel events of each write.',
    link: '/digging-deeper/events-and-hooks'
  },
  {
    icon: 'i-lucide-terminal',
    title: 'Searches outside HTTP',
    text: 'Replay a client search from a job or a command with Rest::search(), with the same checks.',
    link: '/search/outside-http'
  }
]
