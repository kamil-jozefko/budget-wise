<template>
  <div class="flex flex-col flex-1 w-full">
    <label
      v-if="label"
      class="text-primaryText text-base font-medium leading-normal pb-2 sm:text-sm md:text-base lg:text-lg"
    >
      <span
        v-if="required"
        class="text-red-500"
      >*</span> {{ label }}
    </label>

    <select
      v-bind="$attrs"
      v-model="modelValue"
      :disabled="disabled"
      :required="required"
      :name="name"
      :class="[
        size === 'sm' ? 'form-element-sm' : 'form-element',
        { 'form-element--error': error },
        'w-full sm:text-sm md:text-base lg:text-lg sm:p-2 md:p-3 lg:p-4 bg-white text-primaryText border border-cardBorder',
      ]"
    >
      <option
        v-if="placeholder"
        value=""
        disabled
      >
        {{ placeholder }}
      </option>
      <option
        v-for="option in options"
        :key="typeof option === 'string' ? option : option.value"
        :value="typeof option === 'string' ? option : option.value"
      >
        {{ typeof option === 'string' ? t('baseSelect.options.' + option) : option.label }}
      </option>
    </select>
    <span
      v-if="error"
      class="form-error-message"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'

const { t } = useI18n()

interface Option {
  value: string
  label: string
}

interface Props {
  label?: string
  placeholder?: string
  name: string
  options: (string | Option)[]
  disabled?: boolean
  required?: boolean
  error?: string
  size?: 'md' | 'sm'
}

const modelValue = defineModel({ type: String })

withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  size: 'md',
})

watch(modelValue, () => {
  // Removed console.log for production cleanliness
})
</script>
