/**
 * The endpoint tour. Every declaration, request and answer is taken from the
 * page that `link` names; `excerpt` marks a declaration cut to its point.
 */
export interface EndpointExample {
  key: string
  label: string
  icon: string
  title: string
  text: string
  link: string
  php?: { file: string, code: string, excerpt?: boolean }
  method: 'GET' | 'POST' | 'DELETE'
  uri: string
  body?: string
  status: string
  response: string
  note?: string
}

export const endpointExamples: EndpointExample[] = [
  {
    key: 'aggregates',
    label: 'Aggregates',
    icon: 'i-lucide-sigma',
    title: 'Count and total related rows',
    text: 'count, exists, min, max, avg and sum over a relation, computed in SQL next to each row.',
    link: '/search/includes-and-aggregates#aggregates',
    php: { file: 'CategoryResource.php', excerpt: true, code: `public function relations(): array
{
    return [
        HasMany::make('products', ProductResource::class),
    ];
}` },
    method: 'POST',
    uri: '/api/categories/search',
    body: `{
  "search": {
    "aggregates": [
      {"relation": "products", "type": "count"},
      {"relation": "products", "type": "max", "field": "price"}
    ]
  }
}`,
    status: '200 OK',
    response: `{
  "current_page": 1,
  "data": [
    {"id": 1, "name": "Lighting", "products_count": 2, "products_max_price": 129}
  ],
  "from": 1,
  "last_page": 1,
  "per_page": 50,
  "to": 1,
  "total": 1,
  "meta": {}
}`
  },
  {
    key: 'mutate',
    label: 'Nested writes',
    icon: 'i-lucide-git-merge',
    title: 'Write rows and their relations at once',
    text: 'Create, update, attach, sync or detach, nested up to three levels by default, in one database transaction: every entry is written, or none.',
    link: '/writing/mutate',
    php: { file: 'CategoryResource.php', excerpt: true, code: `public function relations(): array
{
    return [
        HasMany::make('products', ProductResource::class),
        BelongsToMany::make('featuredProducts', ProductResource::class),
    ];
}` },
    method: 'POST',
    uri: '/api/categories/mutate',
    body: `{
  "mutate": [
    {
      "operation": "create",
      "attributes": {"name": "Lighting"},
      "relations": {
        "products": [
          {"operation": "create", "attributes": {"name": "Desk lamp", "price": 39}},
          {"operation": "attach", "key": [4, 5]}
        ]
      }
    },
    {"operation": "update", "key": 2, "attributes": {"name": "Seating"}}
  ]
}`,
    status: '200 OK',
    response: `{
  "operations": [
    {
      "operation": "create",
      "key": 3,
      "relations": {
        "products": [
          {"operation": "create", "key": 9},
          {"operation": "attach", "key": [4, 5]}
        ]
      }
    },
    {"operation": "update", "key": 2}
  ]
}`
  },
  {
    key: 'actions',
    label: 'Actions',
    icon: 'i-lucide-zap',
    title: 'Run your own code on rows',
    text: 'An action class gets its own route, typed inputs and the rows of a search. Queue it, batch it, or make the client confirm it first.',
    link: '/actions-and-metrics/actions',
    php: { file: 'app/Rest/Actions/ExtendSubscriptions.php', excerpt: true, code: `public function fields(): array
{
    return [
        Date::make('expires_at')->rules('required'),
        Enum::make('plan', Plan::class)->default(Plan::Monthly),
    ];
}

public function handle(ActionFields $fields, Collection $models): void
{
    foreach ($models as $subscription) {
        $subscription->update(['expires_at' => $fields->expires_at, 'plan' => $fields->plan]);
    }
}` },
    method: 'POST',
    uri: '/api/subscriptions/actions/extend-subscriptions',
    body: `{
  "fields": [{"name": "expires_at", "value": "2027-01-31"}],
  "search": {"filters": [{"field": "status", "value": "active"}]}
}`,
    status: '200 OK',
    response: `{"data": {"impacted": 11, "result": null}}`
  },
  {
    key: 'instructions',
    label: 'Instructions',
    icon: 'i-lucide-wand-sparkles',
    title: 'Query logic that clients can call by name',
    text: 'An instruction is a class with typed, validated fields that changes the query of a search. Scopes of your models work the same way.',
    link: '/search/scopes-and-instructions#instructions',
    php: { file: 'app/Rest/Instructions/PriceRange.php', excerpt: true, code: `class PriceRange extends Instruction
{
    public function fields(): array
    {
        return [
            Integer::make('min')->default(0),
            Integer::make('max')->rules('required'),
        ];
    }

    public function handle(InstructionFields $fields, Builder $query): void
    {
        $query->whereBetween('price', [$fields->min, $fields->max]);
    }
}` },
    method: 'POST',
    uri: '/api/products/search',
    body: `{
  "search": {
    "instructions": [
      {"name": "price-range", "fields": [{"name": "max", "value": 100}]}
    ]
  }
}`,
    status: '200 OK',
    response: `{
  "current_page": 1,
  "data": [
    {"id": 1, "category_id": 1, "name": "Desk lamp", "price": 39}
  ],
  "from": 1,
  "last_page": 1,
  "per_page": 50,
  "to": 1,
  "total": 1,
  "meta": {}
}`,
    note: 'example data'
  },
  {
    key: 'metrics',
    label: 'Metrics',
    icon: 'i-lucide-chart-column',
    title: 'Numbers for your dashboards',
    text: 'Values, partitions, progress, trends and tables over the same rows as the list next to them, with ranges, time zones and a cache.',
    link: '/actions-and-metrics/metrics',
    php: { file: 'app/Rest/Metrics/TotalRevenue.php', excerpt: true, code: `class TotalRevenue extends Value
{
    public function calculate(Builder $query): ValueResult
    {
        return $this->sum($query, 'price', 'placed_at');
    }

    public function ranges(): array
    {
        return [30 => '30 days', 90 => '90 days'];
    }
}` },
    method: 'POST',
    uri: '/api/orders/metrics/total-revenue',
    body: '{}',
    status: '200 OK',
    response: `{"data": {"type": "value", "value": 52.0, "previous": 37.25}}`
  },
  {
    key: 'details',
    label: 'Details',
    icon: 'i-lucide-list-tree',
    title: 'A description of the resource, for this user',
    text: 'Fields, operators, rules, relations, actions and authorizations: a frontend reads it to build its lists and forms. Ask only for the parts you need with with.',
    link: '/digging-deeper/details',
    method: 'GET',
    uri: '/api/artworks',
    status: '200 OK',
    response: `{"data": {
  "fields": [
    {"name": "id", "label": null, "type": "id", "nullable": false},
    {"name": "title", "label": "Title", "type": "text", "nullable": false},
    {"name": "medium", "label": null, "type": "enum", "nullable": false, "values": ["oil", "ink", "watercolor"]}
  ],
  "limits": [10, 25, 50],
  "meta": {}
}}`
  },
  {
    key: 'delete',
    label: 'Delete and restore',
    icon: 'i-lucide-trash-2',
    title: 'Delete, restore and force delete',
    text: 'Keys in, rows out, in one transaction, after the delete, restore or forceDelete policy of every row.',
    link: '/writing/deleting',
    php: { file: 'routes/api.php', code: `Rest::resource('documents', DocumentsController::class)->withSoftDeletes();` },
    method: 'DELETE',
    uri: '/api/documents',
    body: `{
  "resources": [1, 2]
}`,
    status: '200 OK',
    response: `{
  "data": [
    {"id": 1, "title": "Annual report", "archived": false},
    {"id": 2, "title": "Budget", "archived": false}
  ],
  "meta": {}
}`
  }
]
