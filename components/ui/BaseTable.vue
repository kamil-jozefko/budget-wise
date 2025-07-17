<template>
  <BaseCard
    :rounded="rounded"
    :bg="bg"
    :border="border"
    :border-color="borderColor"
    class="gap-4 pb-4 overflow-x-auto w-full transition-colors duration-300"
  >
    <table class="flex-1 min-w-[600px] w-full">
      <thead>
        <tr>
          <slot name="header" />
        </tr>
      </thead>
      <tbody>
        <slot name="body" />
      </tbody>
    </table>
    <slot name="pagination" />
  </BaseCard>
</template>

<script setup lang="ts">
import BaseCard from '~/components/ui/BaseCard.vue'

defineProps<{
  rounded?: string
  bg?: string
  border?: boolean
  borderColor?: string
}>()
</script>

<style lang="scss">
// No transaction-specific styles
</style>
