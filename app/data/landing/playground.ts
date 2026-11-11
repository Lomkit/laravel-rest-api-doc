/**
 * The search playground: four example products in two categories, and the
 * answer that the search endpoint gives for each combination of options, as
 * the Search overview, Filters, Sorts and Includes pages describe it.
 */
export interface Product {
  id: number
  category_id: number
  name: string
  price: number
}

export const products: Product[] = [
  { id: 1, category_id: 1, name: 'Desk lamp', price: 39 },
  { id: 2, category_id: 1, name: 'Floor lamp', price: 129 },
  { id: 3, category_id: 2, name: 'Office chair', price: 149 },
  { id: 4, category_id: 2, name: 'Bar stool', price: 109 }
]

const categories: Record<number, string> = { 1: 'Lighting', 2: 'Seating' }

export type OptionKey = 'cheap' | 'lighting' | 'sort' | 'include' | 'gates' | 'limit'

export interface PlaygroundOption {
  key: OptionKey
  label: string
  part: string
}

export const playgroundOptions: PlaygroundOption[] = [
  { key: 'cheap', label: 'Price under 100', part: 'filters' },
  { key: 'lighting', label: 'In the Lighting category', part: 'filters · relation path' },
  { key: 'sort', label: 'Most expensive first', part: 'sorts' },
  { key: 'include', label: 'With their category', part: 'includes' },
  { key: 'gates', label: 'May I update each one?', part: 'gates' },
  { key: 'limit', label: '10 per page', part: 'limit' }
]

export const updatePolicy = `public function update(User $user, Product $product): Response
{
    return $product->price > 100
        ? Response::deny('Products above 100 are locked.')
        : Response::allow();
}`

const json = (value: unknown) => JSON.stringify(value).replace(/":/g, '": ').replace(/,"/g, ', "')

export function searchBody(on: Set<OptionKey>): string {
  const filters = [
    ...(on.has('cheap') ? ['{"field": "price", "operator": "<", "value": 100}'] : []),
    ...(on.has('lighting') ? ['{"field": "category.name", "value": "Lighting"}'] : [])
  ]
  const lines = [
    filters.length ? `    "filters": [\n${filters.map(filter => `      ${filter}`).join(',\n')}\n    ]` : null,
    on.has('sort') ? '    "sorts": [{"field": "price", "direction": "desc"}]' : null,
    on.has('include') ? '    "includes": [{"relation": "category"}]' : null,
    on.has('gates') ? '    "gates": ["update"]' : null,
    on.has('limit') ? '    "limit": 10' : null
  ].filter(line => line !== null)

  return lines.length ? `{\n  "search": {\n${lines.join(',\n')}\n  }\n}` : '{\n  "search": {}\n}'
}

function row(product: Product, on: Set<OptionKey>): string {
  const parts = [`      "id": ${product.id}, "category_id": ${product.category_id}, "name": "${product.name}", "price": ${product.price}`]

  if (on.has('gates')) {
    const gate = product.price > 100
      ? '"allowed": false, "message": "Products above 100 are locked."'
      : '"allowed": true, "message": null'
    parts.push(`      "gates": {"authorized_to_update": {\n        ${gate}\n      }}`)
  }

  if (on.has('include')) {
    parts.push(`      "category": ${json({ id: product.category_id, name: categories[product.category_id] })}`)
  }

  return `    {\n${parts.join(',\n')}\n    }`
}

export function searchResponse(on: Set<OptionKey>): string {
  const rows = products
    .filter(product => !on.has('cheap') || product.price < 100)
    .filter(product => !on.has('lighting') || categories[product.category_id] === 'Lighting')
    .sort((a, b) => (on.has('sort') ? b.price - a.price : 0) || b.id - a.id)
  const perPage = on.has('limit') ? 10 : 50
  const data = rows.length ? `[\n${rows.map(product => row(product, on)).join(',\n')}\n  ]` : '[]'

  return [
    '{',
    '  "current_page": 1,',
    `  "data": ${data},`,
    `  "from": ${rows.length ? 1 : null}, "last_page": 1, "per_page": ${perPage},`,
    `  "to": ${rows.length || null}, "total": ${rows.length}, "meta": {}`,
    '}'
  ].join('\n')
}
