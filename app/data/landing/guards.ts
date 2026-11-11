/**
 * The checks of a mutation, in the order of the Policies, Validation and
 * Mutate pages, and five requests that stop at each of them.
 */
export interface GuardStage {
  title: string
  icon: string
  text: string
}

export const guardStages: GuardStage[] = [
  { title: 'Entry checks', icon: 'i-lucide-door-open', text: 'viewAny on every resource the request reaches, before validation.' },
  { title: 'Validation', icon: 'i-lucide-list-checks', text: 'Declared fields and rules only, keys read inside the perimeter.' },
  { title: 'Row checks', icon: 'i-lucide-shield-check', text: 'In the transaction, the policy of every row, before the first write.' },
  { title: 'Write', icon: 'i-lucide-database', text: 'Every entry is written, or the transaction rolls back.' }
]

export interface GuardCase {
  label: string
  stop: number | null
  body: string
  status: string
  response: string
  why: string
  code?: { file: string, text: string }
}

export const guardCases: GuardCase[] = [
  {
    label: 'A user who may not list products',
    stop: 0,
    body: `{
  "mutate": [
    {"operation": "update", "key": 1, "attributes": {"cost": 20}}
  ]
}`,
    status: '403 Forbidden',
    response: `{"message": "This action is unauthorized."}`,
    why: 'The policy refuses viewAny: the request stops before validation, even with an invalid payload, and before any query.'
  },
  {
    label: 'A field the resource does not declare',
    stop: 1,
    body: `{
  "mutate": [
    {"operation": "update", "key": 1, "attributes": {"cost": 20}}
  ]
}`,
    status: '422 Unprocessable Content',
    response: `{
  "message": "The cost key of the mutate.0.attributes field is not writable on update.",
  "errors": {
    "mutate.0.attributes": [
      "The cost key of the mutate.0.attributes field is not writable on update."
    ]
  }
}`,
    why: 'Only the fields of the resource can be written. Adding a column to a table never exposes it.'
  },
  {
    label: 'A product of another team',
    stop: 1,
    body: `{
  "mutate": [
    {"operation": "update", "key": 7, "attributes": {"price": 20}}
  ]
}`,
    status: '422 Unprocessable Content',
    response: `{
  "message": "The selected mutate.0.key is invalid.",
  "errors": {
    "mutate.0.key": ["The selected mutate.0.key is invalid."]
  }
}`,
    why: 'Keys are read through the perimeter: for this user, the row does not exist.',
    code: { file: 'ProductResource.php', text: `public function perimeterQuery(Builder $query): Builder
{
    return $query->where('team_id', $this->request()->user()->team_id);
}` }
  },
  {
    label: 'A product above 100',
    stop: 2,
    body: `{
  "mutate": [
    {"operation": "update", "key": 2, "attributes": {"price": 99}}
  ]
}`,
    status: '403 Forbidden',
    response: `{"message": "Products above 100 are locked."}`,
    why: 'Every row is checked before the first write: the message of your policy comes back as it is.',
    code: { file: 'app/Policies/ProductPolicy.php', text: `public function update(User $user, Product $product): Response
{
    return $product->price > 100
        ? Response::deny('Products above 100 are locked.')
        : Response::allow();
}` }
  },
  {
    label: 'A valid update',
    stop: null,
    body: `{
  "mutate": [
    {"operation": "update", "key": 1, "attributes": {"price": 35}}
  ]
}`,
    status: '200 OK',
    response: `{
  "operations": [
    {"operation": "update", "key": 1}
  ]
}`,
    why: 'Every check passed: the write runs in one database transaction.'
  }
]
