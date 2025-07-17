<template>
  <div
    class="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-white text-slate-800"
  >
    <div class="flex h-full grow flex-col">
      <DashboardHeader />
      <main class="px-4 sm:px-8 md:px-16 lg:px-40 flex flex-1 justify-center py-5">
        <div class="flex flex-col w-full max-w-full sm:max-w-[640px] md:max-w-[800px] lg:max-w-[960px]">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import DashboardHeader from '~/components/layout/DashboardHeader.vue'
</script>
