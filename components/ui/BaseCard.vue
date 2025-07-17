<template>
  <div
    :class="[
      'flex flex-col',
      roundedClass,
      borderClass,
      paddingClass,
      bgClass,
      'shadow-sm transition-shadow duration-200 hover:shadow-lg',
      customClass,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  rounded: {
    type: String,
    default: 'lg', // default size is 'lg'
  },
  border: {
    type: Boolean,
    default: true,
  },
  borderColor: {
    type: String,
    default: '#dee4dc',
  },
  padding: {
    type: String,
    default: 'p-6',
  },
  bg: {
    type: String,
    default: 'white', // default color is 'white'
  },
  customClass: {
    type: String,
    default: '',
  },
  shadow: {
    type: String,
    default: 'shadow-sm', // allow override if needed
  },
})

const roundedClass = computed(() => props.rounded === 'xl' ? 'rounded-xl' : 'rounded-lg')
const borderClass = computed(() => `border border-[${props.borderColor}] border-opacity-60`)
const paddingClass = computed(() => props.padding)
const bgClass = computed(() => props.bg.startsWith('#') ? `bg-[${props.bg}]` : `bg-${props.bg}`)
</script>

<style scoped>
/* Modern card tweaks if needed */
</style>
