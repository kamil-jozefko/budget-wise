<template>
  <div class="flex flex-col w-full max-w-5xl mx-auto gap-6">
    <BaseHeader :title="t('transactions.edit')" />
    <div class="w-full max-w-full sm:max-w-[480px]">
      <client-only>
        <TransactionForm
          v-if="transaction"
          ref="transactionFormRef"
          :transaction="transaction"
          :loading="isLoading"
          @submit="handleFormSubmit"
          @cancel="navigateBack"
        />
        <div
          v-else
          class="text-center text-gray-400 py-8"
        >
          {{ t('common.loading') }}
        </div>
      </client-only>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from 'nuxt/app'
import { useRoute, navigateTo } from '#imports'

import TransactionForm from '~/components/dashboard/transactions/TransactionForm.vue'
import { useTransactionsStore } from '~/stores/transactions'
import { useNotificationStore } from '~/stores/notification'
import type { Transaction, TransactionFormData } from '~/types/transaction'
import BaseHeader from '~/components/layout/BaseHeader.vue'

const { t } = useI18n()
const route = useRoute()
const transactionsStore = useTransactionsStore()
const notificationStore = useNotificationStore()

definePageMeta({
  layout: 'dashboard-layout',
})

const transaction = ref<Transaction | null>(null)
const transactionFormRef = ref()
const isLoading = ref(false)

const loadTransaction = async () => {
  isLoading.value = true
  // If the store is empty, fetch transactions
  if (!transactionsStore.transactions.length) {
    await transactionsStore.fetchTransactions()
  }
  const foundTransaction = transactionsStore.transactions.find(
    t => String(t.id) === String(route.params.id),
  )
  if (foundTransaction) {
    transaction.value = { ...foundTransaction }
  }
  else if (transactionsStore.transactions.length > 0) {
    notificationStore.addNotification({
      title: t('error'),
      description: t('transactions.notFound'),
      type: 'error',
    })
  }
  isLoading.value = false
}

watch(
  () => transactionsStore.transactions.length,
  async () => {
    await loadTransaction()
  },
  { immediate: true },
)

const handleFormSubmit = async (formData: TransactionFormData) => {
  if (!transaction.value) return

  try {
    isLoading.value = true

    await transactionsStore.updateTransaction(transaction.value.id, formData)

    notificationStore.addNotification({
      title: t('success'),
      description: t('transactions.updateSuccess'),
      type: 'success',
    })
    navigateBack()
  }
  catch {
    notificationStore.addNotification({
      title: t('error'),
      description: t('transactions.updateError'),
      type: 'error',
    })
  }
  finally {
    isLoading.value = false
  }
}

const navigateBack = () => {
  navigateTo('/dashboard/transactions')
}

useHead({
  title: `${t('transactions.edit')} - ${t('app.name')}`,
  meta: [
    {
      name: 'description',
      content: t('transactions.meta.editDescription'),
    },
  ],
})
</script>
