<template>
  <NuxtLayout>
    <NuxtPage />
    <client-only>
      <NotificationToast />
    </client-only>
  </NuxtLayout>
</template>

<script setup lang="ts">
import NotificationToast from './components/layout/NotificationToast.vue'
</script>
