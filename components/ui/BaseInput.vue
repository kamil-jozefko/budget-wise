<template>
  <div class="flex flex-col flex-1 w-full">
    <label
      v-if="label"
      :for="name"
      class="text-primaryText text-base font-medium leading-normal pb-2 sm:text-sm md:text-base lg:text-lg"
    >
      <span
        v-if="required"
        class="text-red-500"
      >*</span> {{ label }}
    </label>

    <div class="relative">
      <div
        v-if="leftIcon"
        class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
        :class="iconSize"
      >
        <slot name="leftIcon">
          <Icon
            :name="leftIcon"
            :class="iconColor"
          />
        </slot>
      </div>

      <input
        v-model="modelValue"
        v-bind="$attrs"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :required="required"
        class="w-full sm:text-sm md:text-base lg:text-lg sm:p-2 md:p-3 lg:p-4 bg-white text-primaryText border border-cardBorder focus:outline-0 focus:ring-0 focus:border-cardBorder"
        :class="[
          size === 'sm' ? 'form-element-sm' : 'form-element',
          {
            'form-element--error': !!displayedError,
            'pl-10': $slots.leftIcon || leftIcon,
            'pr-10': ($slots.rightIcon || rightIcon) || (clearable && modelValue && !$slots.rightIcon && !rightIcon),
            'pr-16': (($slots.rightIcon || rightIcon) && clearable && modelValue),
          },
        ]"
      >

      <button
        v-if="clearable && modelValue && !$slots.rightIcon && !rightIcon"
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-700 transition-colors"
        :class="iconSize"
        :disabled="disabled"
        @click="clearInput"
      >
        <Icon
          :name="clearIcon"
          class="text-gray-400 hover:text-gray-600"
        />
      </button>

      <div
        v-if="$slots.rightIcon || rightIcon"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1"
      >
        <button
          v-if="clearable && modelValue"
          type="button"
          class="hover:text-gray-700 transition-colors"
          :class="iconSize"
          :disabled="disabled"
          @click="clearInput"
        >
          <Icon
            :name="clearIcon"
            class="text-gray-400 hover:text-gray-600"
          />
        </button>

        <div
          v-if="rightIcon"
          :class="[iconSize, rightIconClickable ? 'cursor-pointer' : 'pointer-events-none']"
          @click="rightIconClickable ? onRightIconClick() : null"
        >
          <slot name="rightIcon">
            <Icon
              :name="rightIcon"
              :class="iconColor"
            />
          </slot>
        </div>
      </div>
    </div>

    <span
      v-if="displayedError"
      class="form-error-message mt-1 text-sm text-red-600"
    >
      {{ displayedError }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

interface Props {
  label?: string
  name: string
  placeholder?: string
  type?: string
  disabled?: boolean
  required?: boolean
  size?: 'md' | 'sm'
  leftIcon?: string
  rightIcon?: string
  clearable?: boolean
  clearIcon?: string
  rightIconClickable?: boolean
  debounceMs?: number
  error?: string
}

interface Emits {
  input: [value: string | number]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
  enter: [event: KeyboardEvent]
  escape: [event: KeyboardEvent]
  rightIconClick: []
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  size: 'md',
  clearable: false,
  clearIcon: 'tabler:x',
  rightIconClickable: false,
  debounceMs: 0,
})

const emit = defineEmits<Emits>()
const modelValue = defineModel({ type: [String, Number] })

const inputRef = ref<HTMLInputElement>()

const iconSize = computed(() =>
  props.size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
)

const iconColor = computed(() =>
  props.disabled ? 'text-gray-300' : 'text-gray-400',
)

const clearInput = () => {
  modelValue.value = props.type === 'number' ? 0 : ''
  emit('clear')
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const onRightIconClick = () => {
  if (props.rightIconClickable) {
    emit('rightIconClick')
  }
}

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

const displayedError = computed(() => props.error)

watch(modelValue, () => {
  // Removed console.log for production cleanliness
})

defineExpose({
  focus,
  blur,
  inputRef,
})
</script>
