<template>
  <BaseSelect
    v-model="modelValueProxy"
    :options="localeOptions"
    name="locale"
    size="md"
    :label="label"
    :required="false"
  />
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import BaseSelect from '../ui/BaseSelect.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ modelValue: string, setLocale?: (locale: string) => void, label?: string }>()
const emit = defineEmits(['update:modelValue'])

const { t, availableLocales: locales, locale } = useI18n()

const modelValueProxy = ref(props.modelValue || locale.value)

watch(() => props.modelValue, (val) => {
  modelValueProxy.value = val
})

watch(modelValueProxy, (val) => {
  emit('update:modelValue', val)
  if (props.setLocale) props.setLocale(val)
})

const localeOptions = computed(() =>
  locales.map(code => ({
    label: code.toUpperCase(),
    value: code,
  })),
)

const label = computed(() => props.label || t('profile.languageLabel'))
</script>

<style>

</style>
