<script setup lang="ts">
const handWritten = `class ProductController extends Controller
{
    public function index(Request $request)
    {
        Gate::authorize('viewAny', Product::class);

        $validated = $request->validate([
            'max_price' => ['nullable', 'integer'],
            'with_category' => ['boolean'],
            'per_page' => ['in:10,25,50'],
        ]);

        $products = Product::query()
            ->when($validated['max_price'] ?? null, fn ($query, $price) => $query->where('price', '<', $price))
            ->when($validated['with_category'] ?? false, fn ($query) => $query->with('category'))
            ->latest('id')
            ->paginate($validated['per_page'] ?? 50);

        return ProductResource::collection($products);
    }

    public function store(StoreProductRequest $request)
    {
        Gate::authorize('create', Product::class);

        return new ProductResource(Product::create($request->validated()));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        Gate::authorize('update', $product);

        $product->update($request->validated());

        return new ProductResource($product);
    }

    public function destroy(Product $product)
    {
        Gate::authorize('delete', $product);

        $product->delete();

        return response()->noContent();
    }
}`

const declared = `class ProductResource extends Resource
{
    public static string $model = Product::class;

    public function fields(): array
    {
        return [
            ID::make('id'),
            Integer::make('category_id'),
            Text::make('name')->rules('max:255')->creationRules('required'),
            Integer::make('price')->rules('min:0'),
        ];
    }

    public function relations(): array
    {
        return [
            BelongsTo::make('category', CategoryResource::class),
        ];
    }
}`

const handLines = handWritten.split('\n').length
const declaredLines = declared.split('\n').length

const rows = [
  { topic: 'Filters', before: 'One, written by hand: price below a value.', after: 'Every declared field, with the operators of its type, nested groups and relation paths.' },
  { topic: 'Includes', before: 'The category, on or off.', after: 'Every declared relation, nested, filtered, sorted and limited per parent row.' },
  { topic: 'Writes', before: 'One product per request.', after: 'Batches with nested relations, in one transaction.' },
  { topic: 'Authorization', before: 'One Gate call per method.', after: 'Policies on every resource the request reaches, row checks before the first write.' },
  { topic: 'Documentation', before: 'To write and keep in sync.', after: 'OpenAPI generated from the declarations.' }
]
</script>

<template>
  <section
    id="compare"
    class="relative py-16 sm:py-24"
  >
    <UContainer>
      <LandingReveal class="mx-auto max-w-3xl text-center">
        <p class="text-sm font-semibold text-primary">
          Before / after
        </p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-balance text-highlighted sm:text-4xl">
          Less code, and it answers more requests
        </h2>
        <p class="mt-4 text-base text-pretty text-muted sm:text-lg">
          A typical hand-written controller for products, which also needs two form requests, a JSON resource and its routes,
          next to the resource that replaces them, plus one route line.
        </p>
      </LandingReveal>

      <LandingReveal
        class="mt-12 grid gap-4 lg:grid-cols-2"
        :delay="100"
      >
        <LandingWindow
          title="app/Http/Controllers/ProductController.php"
          icon="i-vscode-icons-file-type-php3"
          class="opacity-90"
        >
          <template #actions>
            <UBadge
              color="neutral"
              variant="subtle"
              size="sm"
              :label="`${handLines} lines + 3 files`"
            />
          </template>
          <div
            class="h-[380px] overflow-auto py-3 text-[10.5px] leading-[1.6] sm:text-[11px]"
            tabindex="0"
            aria-label="Hand-written controller"
          >
            <LandingCode
              :code="handWritten"
              lang="php"
              line-numbers
            />
          </div>
        </LandingWindow>

        <LandingWindow
          title="app/Rest/Resources/ProductResource.php"
          icon="i-vscode-icons-file-type-php3"
          class="ring-1 ring-primary/30"
        >
          <template #actions>
            <UBadge
              size="sm"
              :label="`${declaredLines} lines`"
            />
          </template>
          <div class="h-[380px] overflow-x-auto overflow-y-hidden py-3 text-[10.5px] leading-[1.6] sm:text-[11px]">
            <LandingCode
              :code="declared"
              lang="php"
              line-numbers
            />
          </div>
        </LandingWindow>
      </LandingReveal>

      <LandingReveal
        class="mt-6 overflow-hidden rounded-xl border border-default bg-default dark:bg-neutral-950/60"
        :delay="150"
      >
        <table class="w-full text-left text-sm">
          <thead class="hidden bg-elevated/50 text-xs text-dimmed uppercase sm:table-header-group">
            <tr>
              <th class="px-4 py-3 font-semibold tracking-wider" />
              <th class="px-4 py-3 font-semibold tracking-wider">
                Hand-written
              </th>
              <th class="px-4 py-3 font-semibold tracking-wider text-primary">
                Resource
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-default">
            <tr
              v-for="row in rows"
              :key="row.topic"
              class="grid gap-1 px-4 py-3 sm:table-row sm:p-0"
            >
              <th class="font-semibold text-highlighted sm:w-40 sm:px-4 sm:py-3">
                {{ row.topic }}
              </th>
              <td class="flex gap-2 text-muted sm:table-cell sm:px-4 sm:py-3">
                <UIcon
                  name="i-lucide-minus"
                  class="mt-0.5 size-4 shrink-0 text-dimmed sm:hidden"
                />
                {{ row.before }}
              </td>
              <td class="flex gap-2 text-toned sm:table-cell sm:px-4 sm:py-3">
                <UIcon
                  name="i-lucide-check"
                  class="mt-0.5 size-4 shrink-0 text-primary sm:hidden"
                />
                {{ row.after }}
              </td>
            </tr>
          </tbody>
        </table>
      </LandingReveal>

      <p class="mx-auto mt-6 max-w-2xl text-center text-sm text-dimmed">
        A hand-written controller is the right tool for a one-off endpoint. When the frontend asks for one more filter,
        one more include or one more bulk edit, the resource already answers.
      </p>
    </UContainer>
  </section>
</template>
