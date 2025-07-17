<template>
  <header
    class="flex items-center py-3"
  >
    <div class="flex items-center gap-4 text-primaryText">
      <h2 class="text-lg font-bold leading-tight tracking-[-0.015em]">
        {{ title }}
      </h2>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>
