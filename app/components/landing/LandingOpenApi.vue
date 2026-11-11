<script setup lang="ts">
const operations = [
  { method: 'GET', summary: 'Get Product details', response: 'ProductDetails' },
  { method: 'POST', summary: 'Search Product', response: 'ProductPaginated' },
  { method: 'POST', summary: 'Mutate Product', response: 'ProductMutateResult' },
  { method: 'DELETE', summary: 'Delete Product', response: 'ProductRows' }
]

const filters = [
  { field: 'id', operators: '=, !=, in, not in' },
  { field: 'name', operators: '=, !=, like, not like, ilike, not ilike, in, not in' },
  { field: 'price', operators: '=, !=, >, >=, <, <=, between, not between, in, not in' }
]

const install = `$ composer require dedoc/scramble:^0.13.48
$ php artisan scramble:export`

const boost = `$ composer require laravel/boost --dev
$ php artisan boost:install`
</script>

<template>
  <section
    id="docs"
    class="relative scroll-mt-16 py-14 sm:py-20"
  >
    <UContainer>
      <LandingHeading
        eyebrow="Documented"
        icon="i-lucide-book-open"
        title="The API documents itself"
        text="Your declarations already say what each endpoint accepts. The package turns them into an OpenAPI document through Scramble, and ships a skill so coding agents know the same rules."
        center
      />

      <div class="mt-12 grid gap-6 grid-cols-1 lg:grid-cols-12">
        <LandingReveal
          class="lo-card lg:col-span-8"
          :delay="80"
        >
          <div class="grid gap-0 grid-cols-1 md:grid-cols-[15rem_minmax(0,1fr)]">
            <div class="border-b border-default p-4 md:border-r md:border-b-0">
              <p class="text-xs font-semibold tracking-wider text-muted uppercase">
                Product
              </p>
              <ul class="mt-3 space-y-1.5">
                <li
                  v-for="(operation, index) in operations"
                  :key="operation.summary"
                  class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
                  :class="index === 1 ? 'bg-primary/10 text-highlighted' : 'text-muted'"
                >
                  <span
                    class="w-12 shrink-0 rounded px-1 text-center font-mono text-[10px] font-bold"
                    :class="methodTone[operation.method]"
                  >{{ operation.method }}</span>
                  <span class="truncate">{{ operation.summary }}</span>
                </li>
              </ul>
              <p class="mt-4 font-mono text-xs text-muted">
                /docs/api
              </p>
            </div>
            <div class="min-w-0 p-4 sm:p-5">
              <p class="font-semibold text-highlighted">
                Search Product
              </p>
              <p class="mt-1 font-mono text-xs text-muted">
                POST /api/products/search · body ProductSearch · 200 ProductPaginated
              </p>
              <p class="mt-4 text-xs font-medium text-muted">
                <code>search.filters</code>: one condition per filterable field
              </p>
              <ul class="mt-2 divide-y divide-default rounded-lg border border-default">
                <li
                  v-for="filter in filters"
                  :key="filter.field"
                  class="grid gap-1 px-3 py-2 sm:grid-cols-[4.5rem_minmax(0,1fr)]"
                >
                  <code class="font-mono text-xs font-semibold text-highlighted">{{ filter.field }}</code>
                  <span class="font-mono text-xs text-muted">{{ filter.operators }}</span>
                </li>
              </ul>
              <p class="mt-3 text-xs text-muted">
                Includes, aggregates, scopes, instructions, actions and metrics get their schemas too, with the 401, 403, 404 and 422 responses.
              </p>
            </div>
          </div>
          <div class="border-t border-default bg-elevated/40 py-3 text-[11px] leading-relaxed sm:text-xs">
            <LandingCode
              :code="install"
              lang="bash"
            />
          </div>
          <UButton
            to="/digging-deeper/openapi"
            label="Generate the OpenAPI document"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-right"
            class="mx-4 my-2"
          />
        </LandingReveal>

        <LandingReveal
          class="lo-card flex flex-col p-5 lg:col-span-4"
          :delay="160"
        >
          <span class="flex size-10 items-center justify-center rounded-xl bg-primary/10 ring ring-primary/20">
            <UIcon
              name="i-lucide-bot"
              class="size-5 text-primary"
            />
          </span>
          <h3 class="mt-4 text-lg font-semibold text-highlighted">
            A skill for coding agents
          </h3>
          <p class="mt-2 text-sm text-pretty text-muted">
            The package ships a <code>laravel-rest-api</code> skill for Laravel Boost: resources, payloads, limits,
            authorization and the conventions to keep, for the version you installed.
          </p>
          <div class="mt-5 overflow-x-auto rounded-lg border border-default bg-elevated/40 py-3 text-[11px] leading-relaxed sm:text-xs">
            <LandingCode
              :code="boost"
              lang="bash"
            />
          </div>
          <UButton
            to="/digging-deeper/ai-skill"
            label="Install the skill"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-right"
            class="mt-auto self-start px-0 pt-5"
          />
        </LandingReveal>
      </div>
    </UContainer>
  </section>
</template>

<style scoped>
.lo-card {
  overflow: hidden;
  border: 1px solid var(--ui-border);
  border-radius: 1rem;
  background: var(--ui-bg);
  box-shadow: 0 20px 40px -24px rgb(0 0 0 / 0.18);
}

.dark .lo-card { background: color-mix(in oklab, var(--ui-color-neutral-950) 80%, transparent); }
</style>
