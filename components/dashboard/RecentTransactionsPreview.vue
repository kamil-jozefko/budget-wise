<template>
  <BaseCard
    :rounded="'lg'"
    :bg="'white'"
    class="min-w-72 flex-1 gap-4"
  >
    <div class="flex justify-between items-center">
      <p class="text-primaryText text-base font-medium leading-normal">
        {{ $t('dashboard.recentTransactions') }}
      </p>
      <NuxtLink
        to="/dashboard/transactions"
        class="text-green-700 text-sm font-medium hover:underline"
      >
        {{ $t('dashboard.viewAll') }}
      </NuxtLink>
    </div>

    <div class="space-y-3">
      <div
        v-if="transactions.length === 0"
        class="flex flex-col items-center justify-center py-8 text-gray-400"
      >
        <Icon
          name="tabler:inbox"
          size="32"
          class="mb-2"
        />
        <span>{{ $t('dashboard.noRecentTransactions') }}</span>
        <NuxtLink
          to="/dashboard/transactions/new"
          class="mt-4"
        >
          <BaseButton variant="primary">
            {{ $t('dashboard.addFirstTransaction') }}
          </BaseButton>
        </NuxtLink>
      </div>
      <div
        v-for="transaction in transactions"
        v-else
        :key="transaction.id"
        class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
      >
        <div class="flex flex-col">
          <p class="text-primaryText text-sm font-medium">
            {{ transaction.description }}
          </p>
          <p class="text-xs">
            {{ $t(`categories.${normalizeCategoryKey(transaction.category)}`) }} • {{ formatDate(transaction.date) }}
          </p>
        </div>
        <p
          class="text-sm font-bold"
          :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
        >
          {{ formatAmount(transaction.amount, transaction.type) }}
        </p>
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useCurrencyFormatter } from '~/composables/useCurrencyFormatter'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const { t: $t } = useI18n()
const { formatCurrency } = useCurrencyFormatter()

defineProps<{
  transactions: Array<{
    id: string
    description: string
    category: string
    date: string
    amount: number
    type: 'INCOME' | 'EXPENSE'
  }>
}>()

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString($t('locale'), {
    month: 'short',
    day: 'numeric',
  })
}

const formatAmount = (amount: number, type: string) => {
  const sign = type === 'INCOME' ? '+' : '-'
  return `${sign} ${formatCurrency(amount)}`
}

const normalizeCategoryKey = (category: string) => {
  return category.toLowerCase().replace(/ & | /g, '_')
}
</script>
