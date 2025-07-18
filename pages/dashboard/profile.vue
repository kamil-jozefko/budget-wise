<template>
  <div class="flex flex-col w-full max-w-5xl mx-auto gap-6">
    <BaseHeader :title="t('profile.title')" />
    <form class="flex flex-col gap-6 w-full max-w-full sm:max-w-[480px]">
      <BaseSelect
        v-model="currentCurrency"
        name="currency"
        :label="t('profile.currencyLabel')"
        :options="currencyOptions"
      />
      <LocaleSwitcher
        v-model="currentLocale"
        :label="t('profile.languageLabel')"
      />
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import LocaleSwitcher from '@/components/layout/LocaleSwitcher.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import { useCurrencyStore } from '~/stores/user'
import BaseHeader from '~/components/layout/BaseHeader.vue'

const { t, setLocale, locale } = useI18n()

const currencyStore = useCurrencyStore()
const currentCurrency = ref<string>(currencyStore.currency)
const currentLocale = ref<'en' | 'pl'>(locale.value as 'en' | 'pl')

const currencyOptions = computed(() => [
  { value: '$', label: t('profile.currencyUSD') },
  { value: 'zł', label: t('profile.currencyPLN') },
])

definePageMeta({
  layout: 'dashboard-layout',
})

watch(currentCurrency, (newVal: string) => {
  currencyStore.setCurrency(newVal as 'zł' | '$')
})

watch(currentLocale, (val: 'en' | 'pl') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('locale', val)
  }
  if (typeof setLocale === 'function') setLocale(val)
})
</script>
