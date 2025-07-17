// components/atoms/BaseButton.vue
<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span
      v-if="loading"
      class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"
    />
    <span class="truncate">
      <slot>{{ label }}</slot>
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label?: string
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
})

const emit = defineEmits<{
  click: []
}>()

function handleClick(e: MouseEvent) {
  if (!props.disabled && !props.loading) {
    // @ts-expect-error emit type expects no args, but we want to pass MouseEvent for custom click
    emit('click', e)
  }
}

const buttonClasses = computed(() => {
  const baseClasses = 'relative flex cursor-pointer items-center justify-center overflow-hidden rounded-md font-medium leading-normal tracking-[0.015em] transition-all duration-200 border focus:outline-none focus:ring-1 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'text-green-600 bg-transparent border-green-600 hover:bg-green-50 focus:bg-green-50',
    secondary: 'text-primaryText bg-transparent border-[#dee4dc] hover:bg-green-50 focus:bg-green-50',
    danger: 'text-green-700 bg-transparent border-green-700 hover:bg-green-50 focus:bg-green-50',
  }

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-6 text-lg',
  }

  return [
    baseClasses,
    variantClasses[props.variant],
    sizeClasses[props.size],
    props.fullWidth ? 'w-full' : '',
  ].join(' ')
})
</script>

<style scoped>
/* Minimalist: remove shadow, reduce border radius, no ripple */
</style>
