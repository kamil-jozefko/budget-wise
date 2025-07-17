<template>
  <div
    :class="[
      'flex',
      directionClass,
      gapClass,
      wrapClass,
      justifyClass,
      alignClass,
      customClass,
    ]"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'col', // 'col' or 'row'
  },
  gap: {
    type: [String, Number],
    default: 4, // tailwind gap-x
  },
  wrap: {
    type: Boolean,
    default: false,
  },
  justify: {
    type: String,
    default: '', // e.g. 'between', 'center', 'start', 'end'
  },
  align: {
    type: String,
    default: '', // e.g. 'center', 'start', 'end', 'stretch'
  },
  customClass: {
    type: String,
    default: '',
  },
})

const directionClass = computed(() => props.direction === 'row' ? 'flex-row' : 'flex-col')
const gapClass = computed(() => `gap-${props.gap}`)
const wrapClass = computed(() => props.wrap ? 'flex-wrap' : '')
const justifyClass = computed(() => props.justify ? `justify-${props.justify}` : '')
const alignClass = computed(() => props.align ? `items-${props.align}` : '')
</script>
