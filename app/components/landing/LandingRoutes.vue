<script setup lang="ts">
defineProps<{
  visible?: boolean
}>()

const routeFile = `use Lomkit\\Rest\\Facades\\Rest;

Rest::resource('products', ProductsController::class);`

const routes = [
  { method: 'GET|HEAD', uri: 'api/products', name: 'products.details' },
  { method: 'POST', uri: 'api/products/search', name: 'products.search' },
  { method: 'POST', uri: 'api/products/mutate', name: 'products.mutate' },
  { method: 'POST', uri: 'api/products/actions/{action}', name: 'products.operate' },
  { method: 'POST', uri: 'api/products/metrics/{metric}', name: 'products.metric' },
  { method: 'DELETE', uri: 'api/products', name: 'products.destroy' }
]

const methodColor: Record<string, string> = {
  'GET|HEAD': 'text-sky-600 dark:text-sky-400',
  'POST': 'text-amber-600 dark:text-amber-400',
  'DELETE': 'text-rose-600 dark:text-rose-400'
}
</script>

<template>
  <div class="relative">
    <LandingWindow
      title="routes/api.php"
      icon="i-vscode-icons-file-type-php3"
      class="relative z-10 mr-6 sm:mr-16"
    >
      <div class="overflow-x-auto py-4 text-xs leading-relaxed">
        <LandingCode
          lang="php"
          :code="routeFile"
        />
      </div>
    </LandingWindow>

    <LandingWindow
      title="Terminal"
      icon="i-lucide-terminal"
      class="relative -mt-4 ml-6 sm:ml-16"
      :class="{ 'is-visible': visible }"
    >
      <div class="overflow-x-auto p-4 pt-8 font-mono text-[11px] leading-relaxed sm:text-xs">
        <p class="whitespace-nowrap text-muted">
          <span class="text-dimmed">$</span> php artisan route:list --path=api/products
        </p>
        <table class="mt-3 w-full whitespace-nowrap">
          <tbody>
            <tr
              v-for="(route, index) in routes"
              :key="route.name + route.method"
              class="lr-route"
              :style="{ '--i': index }"
            >
              <td
                class="py-0.5 pr-4 font-semibold"
                :class="methodColor[route.method]"
              >
                {{ route.method }}
              </td>
              <td class="py-0.5 pr-4 text-highlighted">
                {{ route.uri }}
              </td>
              <td class="py-0.5 text-right text-dimmed">
                {{ route.name }}
              </td>
            </tr>
          </tbody>
        </table>
        <p
          class="lr-route mt-3 text-dimmed"
          :style="{ '--i': routes.length + 1 }"
        >
          Showing [6] routes. <span class="text-muted">->withSoftDeletes()</span> adds restore and force delete.
        </p>
      </div>
    </LandingWindow>
  </div>
</template>

<style scoped>
.lr-motion .lr-route {
  opacity: 0;
  transform: translateX(-10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  transition-delay: calc(400ms + var(--i) * 110ms);
}

.lr-motion .is-visible .lr-route {
  opacity: 1;
  transform: none;
}
</style>
