<template>
  <div class="flex flex-col w-full max-w-5xl mx-auto gap-6">
    <BaseHeader :title="t('transactions.addNew')" />
    <div class="w-full max-w-full sm:max-w-[480px]">
      <TransactionForm
        v-if="isClient"
        ref="transactionFormRef"
        :loading="loading"
        @submit="handleFormSubmit"
        @cancel="navigateToTransactions"
      />
      <div
        v-else
        class="text-center text-gray-400 py-8"
      >
        {{ t('common.loading') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHead } from 'nuxt/app'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '~/stores/notification'
import TransactionForm from '~/components/dashboard/transactions/TransactionForm.vue'
import type { TransactionFormData } from '~/types/transaction'
import BaseHeader from '~/components/layout/BaseHeader.vue'

const { t } = useI18n()
const notificationStore = import.meta.client ? useNotificationStore() : null

const isClient = ref(false)

onMounted(() => {
  isClient.value = true
})

definePageMeta({
  layout: 'dashboard-layout',
})

const transactionFormRef = ref()
const transactionsStore = import.meta.client ? useTransactionsStore() : null
const loading = computed(() => (transactionsStore ? transactionsStore.loading : false))

const handleFormSubmit = async (formData: TransactionFormData) => {
  if (!import.meta.client || !transactionsStore || !notificationStore) return
  try {
    const result = await transactionsStore.addTransaction(formData)
    if (result.error) {
      throw new Error('Failed to add transaction')
    }
    notificationStore.addNotification({
      title: t('success'),
      description: t('transactions.addSuccess'),
      type: 'success',
    })
    transactionFormRef.value?.resetForm()
    navigateTo('/dashboard/transactions')
  }
  catch {
    notificationStore.addNotification({
      title: t('error'),
      description: t('transactions.addError'),
      type: 'error',
    })
  }
}

const navigateToTransactions = () => {
  if (import.meta.client) navigateTo('/dashboard/transactions')
}

useHead({
  title: `${t('transactions.addNew')} - ${t('app.name')}`,
  meta: [
    {
      name: 'description',
      content: t('transactions.meta.addDescription'),
    },
  ],
})
</script>
