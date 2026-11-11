/**
 * The details of the Details page: the `title` field of the artworks
 * resource, with every part of `fields`, and the page sizes.
 */
export const detailsRequest = 'GET /api/artworks?with=fields.capabilities,fields.filter,fields.rules,fields.meta'

export const detailsResponse = `{"data": {
  "fields": [
    {
      "name": "title", "label": "Title", "type": "text",
      "nullable": false, "select": true, "sort": true,
      "filter": {"operators": [
        "=", "!=", "like", "not like", "ilike", "not ilike", "in", "not in"
      ]},
      "create": true, "update": true,
      "rules": {"all": ["string", "max:120"], "create": ["required"], "update": ["filled"]},
      "meta": {}
    }
  ],
  "limits": [10, 25, 50],
  "meta": {}
}}`

export interface DetailsHint {
  key: string
  needles: string[]
  text: string
}

export const detailsHints: Record<string, DetailsHint> = {
  label: { key: 'label', needles: ['"label"'], text: 'The column and the input take the label of the field.' },
  sort: { key: 'sort', needles: ['"sort"'], text: 'The column offers a sort because the field is sortable.' },
  filter: { key: 'filter', needles: ['"operators"', '"not like"'], text: 'The filter offers the operators that search.filters accepts on this field.' },
  rules: { key: 'rules', needles: ['"rules"'], text: 'The form marks the field required on creation and limits it to 120 characters.' },
  limits: { key: 'limits', needles: ['"limits"'], text: 'The page size picker offers the sizes that search.limit accepts.' }
}

export const frontendPoints = [
  { icon: 'i-lucide-layout-list', text: 'One request per screen: a list, a form or an action dialog asks only for the parts it shows.', link: '/digging-deeper/details#one-request-per-screen' },
  { icon: 'i-lucide-badge-check', text: 'Each row of a search can say whether the user may update or delete it, with the message of your policy.', link: '/search/overview#gates' },
  { icon: 'i-lucide-form-input', text: 'Turn on Laravel Precognition and forms validate as the user types: the same checks, nothing written.', link: '/digging-deeper/precognition' }
]
