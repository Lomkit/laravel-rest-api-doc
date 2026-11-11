/**
 * The hero scene: the resource of the Introduction and Search overview pages,
 * the routes that `Rest::resource()` registers, and three requests whose
 * bodies and answers come from the Quick start and Search pages.
 */
export const heroResource = `class ProductResource extends Resource
{
    public static string $model = Product::class;

    public function fields(): array
    {
        return [
            ID::make('id'),
            Integer::make('category_id'),
            Text::make('name')->creationRules('required'),
            Integer::make('price'),
        ];
    }

    public function relations(): array
    {
        return [
            BelongsTo::make('category', CategoryResource::class),
        ];
    }
}`

export const heroRoute = `Rest::resource('products', ProductsController::class);`

export interface HeroRoute {
  method: 'GET' | 'POST' | 'DELETE'
  uri: string
  endpoint: string
}

export const heroRoutes: HeroRoute[] = [
  { method: 'GET', uri: '/api/products', endpoint: 'details' },
  { method: 'POST', uri: '/api/products/search', endpoint: 'search' },
  { method: 'POST', uri: '/api/products/mutate', endpoint: 'mutate' },
  { method: 'POST', uri: '/api/products/actions/{action}', endpoint: 'operate' },
  { method: 'POST', uri: '/api/products/metrics/{metric}', endpoint: 'metric' },
  { method: 'DELETE', uri: '/api/products', endpoint: 'destroy' }
]

export interface HeroRequest {
  label: string
  route: number
  uses: string[]
  missing?: string
  caption: string
  body: string
  status: number
  statusText: string
  response: string
}

export const heroRequests: HeroRequest[] = [
  {
    label: 'Search',
    route: 1,
    uses: ['\'price\'', 'BelongsTo'],
    caption: 'price and category are declared, so clients can filter on one and include the other.',
    body: `{
  "search": {
    "filters": [
      {"field": "price", "operator": "<", "value": 100}
    ],
    "includes": [{"relation": "category"}]
  }
}`,
    status: 200,
    statusText: 'OK',
    response: `{
  "current_page": 1,
  "data": [{
    "id": 1, "category_id": 1, "name": "Desk lamp",
    "price": 39, "category": {"id": 1, "name": "Lighting"}
  }],
  "from": 1, "last_page": 1, "per_page": 50,
  "to": 1, "total": 1, "meta": {}
}`
  },
  {
    label: 'Unknown field',
    route: 1,
    uses: [],
    missing: 'cost',
    caption: 'cost is not declared, so it does not exist for clients: a 422, before any query runs.',
    body: `{
  "search": {
    "filters": [
      {"field": "cost", "operator": "<", "value": 100}
    ]
  }
}`,
    status: 422,
    statusText: 'Unprocessable Content',
    response: `{
  "message": "The selected search.filters.0.field is invalid.",
  "errors": {
    "search.filters.0.field": [
      "The selected search.filters.0.field is invalid."
    ]
  }
}`
  },
  {
    label: 'Create',
    route: 2,
    uses: ['\'name\'', '\'price\'', 'BelongsTo'],
    caption: 'Create a product and link its category in one request. name is required on creation.',
    body: `{
  "mutate": [{
    "operation": "create",
    "attributes": {"name": "Floor lamp", "price": 129},
    "relations": {
      "category": {"operation": "attach", "key": 1}
    }
  }]
}`,
    status: 200,
    statusText: 'OK',
    response: `{
  "operations": [{
    "operation": "create",
    "key": 2,
    "relations": {
      "category": {"operation": "attach", "key": 1}
    }
  }]
}`
  }
]

/** Timings of the scene, in milliseconds. */
export const heroTimes = {
  routeLine: 500,
  routes: 900,
  routeGap: 170,
  requests: 2300,
  type: 1300,
  send: 1350,
  respond: 1900,
  request: 6200
}

export const heroDuration = heroTimes.requests + heroRequests.length * heroTimes.request
