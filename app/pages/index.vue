<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryContent('/').findOne())

useSeoMeta({
  titleTemplate: '',
  title: page.value.title,
  ogTitle: page.value.title,
  description: page.value.description,
  ogDescription: page.value.description
})
</script>

<template>
  <div>
    <ULandingHero
      v-if="page.hero"
      v-bind="page.hero"
    >
      <template #headline>
        <UBadge
          v-if="page.hero.headline"
          variant="subtle"
          size="lg"
          class="relative rounded-full font-semibold"
        >
          <NuxtLink
            :to="page.hero.headline.to"
            target="_blank"
            class="focus:outline-none"
            tabindex="-1"
          >
            <span
              class="absolute inset-0"
              aria-hidden="true"
            />
          </NuxtLink>

          {{ page.hero.headline.label }}

          <UIcon
            v-if="page.hero.headline.icon"
            :name="page.hero.headline.icon"
            class="ml-1 w-4 h-4 pointer-events-none"
          />
        </UBadge>
      </template>

      <template #title>
        <MDC :value="page.hero.title" />
      </template>

      <MDC
        :value="page.hero.code"
        tag="pre"
        class="prose prose-primary dark:prose-invert mx-auto"
      />
    </ULandingHero>

    <ULandingSection
      :title="page.features.title"
      :links="page.features.links"
      :ui="{wrapper: 'pt-0 sm:pt-0 pb-10 sm:pb-10'}"
    >
      <UPageGrid>
        <ULandingCard
          v-for="(item, index) of page.features.items"
          :key="index"
          v-bind="item"
        />
      </UPageGrid>
    </ULandingSection>

    <span class="w-0 sm:pt-0 pt-0" id="first-setup"></span>

    <ULandingSection :ui="{wrapper: 'pb-0 mb-0 sm:pb-7 pb-5'}"
      title="First setup"
    />

    <template v-for="(onboarding, index) in page.onboardings">
      <ULandingSection v-bind="onboarding" :align="index % 2 === 0 ? 'left' : 'right'" :ui="{wrapper: 'pt-0 sm:pt-0 pb-24 sm:pb-32'}">
        <template #description>
          <span v-if="onboarding.description" v-html="onboarding.description" />
          <MDC v-if="onboarding.terminal" :value="onboarding.terminal" tag="div" class="prose prose-primary dark:prose-invert mx-auto" />
        </template>
        <MDC :value="onboarding.code" tag="pre" class="prose prose-primary dark:prose-invert max-w-none"  />
      </ULandingSection>
    </template>

    <ULandingSection
      align="left"
      :ui="{ base: 'text-center lg:text-left flex flex-col items-center lg:items-start', wrapper: 'pt-0 sm:pt-0 pb-24 sm:pb-32' }"
      class="relative"
      v-bind="page.quickstart"
    >
      <template v-if="page.quickstart.title" #title>
        <span v-html="page.quickstart.title" />
      </template>

      <MDC :value="page.quickstart.code" tag="pre" class="prose prose-primary dark:prose-invert max-w-none" />
    </ULandingSection>
  </div>
</template>
