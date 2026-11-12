<script setup lang="ts">
const route = useRoute()
const toast = useToast()
const site = useSiteConfig()

const copied = ref(false)

const rawPath = computed(() => `/raw${route.path}.md`)
const rawUrl = computed(() => `${site.url.replace(/\/$/, '')}${rawPath.value}`)
const prompt = computed(() => encodeURIComponent(`Read ${rawUrl.value} and answer questions about it.`))

const items = computed(() => [
  {
    label: 'Copy Markdown link',
    icon: 'i-lucide-link',
    async onSelect() {
      await navigator.clipboard.writeText(rawUrl.value)
      toast.add({
        title: 'Copied to clipboard',
        icon: 'i-lucide-check-circle'
      })
    }
  },
  {
    label: 'View as Markdown',
    icon: 'i-simple-icons-markdown',
    target: '_blank',
    to: rawPath.value
  },
  {
    label: 'Open in ChatGPT',
    icon: 'i-simple-icons-openai',
    target: '_blank',
    to: `https://chatgpt.com/?hints=search&q=${prompt.value}`
  },
  {
    label: 'Open in Claude',
    icon: 'i-simple-icons-claude',
    target: '_blank',
    to: `https://claude.ai/new?q=${prompt.value}`
  }
])

async function copyPage() {
  await navigator.clipboard.writeText(await $fetch<string>(rawPath.value, { responseType: 'text' }))
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <UFieldGroup>
    <UButton
      label="Copy page"
      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      color="neutral"
      variant="outline"
      :ui="{
        leadingIcon: [copied ? 'text-primary' : 'text-neutral', 'size-3.5']
      }"
      @click="copyPage"
    />
    <UDropdownMenu
      :items="items"
      :content="{
        align: 'end',
        side: 'bottom',
        sideOffset: 8
      }"
      :ui="{
        content: 'w-52'
      }"
    >
      <UButton
        icon="i-lucide-chevron-down"
        size="sm"
        color="neutral"
        variant="outline"
        aria-label="Open copy actions menu"
      />
    </UDropdownMenu>
  </UFieldGroup>
</template>
