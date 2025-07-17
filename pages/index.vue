<template>
  <div />
</template>

<script setup lang="ts">
await navigateTo('/dashboard')

definePageMeta({
  layout: 'auth-layout',
})

const { t } = useI18n()
useHead({
  title: t('seo.home.title'),
  meta: [
    {
      name: 'description',
      content: t('seo.home.description'),
    },
    {
      name: 'keywords',
      content: t('seo.home.keywords'),
    },
  ],
})
</script>
