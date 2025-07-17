<template>
  <div class="flex flex-col w-full max-w-5xl mx-auto gap-6">
    <BaseHeader :title="t('transactions.title')" />
    <div class="flex flex-col sm:flex-row flex-wrap justify-between gap-2 sm:gap-6 w-full">
      <div class="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full sm:w-auto">
        <BaseButton
          variant="secondary"
          class="w-full sm:w-auto"
          @click="handleLoadDummyData"
        >
          {{ t('transactions.actions.loadDummyData') }}
        </BaseButton>
        <BaseButton
          class="w-full sm:w-auto"
          @click="handleNewTransactionClick"
        >
          {{ t('transactions.actions.new') }}
        </BaseButton>
      </div>
    </div>
    <BaseInput
      v-model="searchQuery"
      name="table-filter"
      :placeholder="t('transactions.search.placeholder')"
      left-icon="tabler:search"
      clearable
      :debounce-ms="300"
      class="w-full"
    />
    <TransactionTable
      :transactions="filteredTransactions"
      :page="page"
      :page-size="pageSize"
      :total="filteredTransactions.length"
      class="w-full"
      @edit="handleEditTransaction"
      @delete="handleDeleteTransaction"
      @update:page="page = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/ui/BaseButton.vue'
import TransactionTable from '~/components/dashboard/transactions/TransactionTable.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseHeader from '~/components/layout/BaseHeader.vue'

const { t } = useI18n()

definePageMeta({
  layout: 'dashboard-layout',
})

useHead({
  title: `${t('transactions.title')} - ${t('app.name')}`,
  meta: [
    {
      name: 'description',
      content: t('transactions.meta.description'),
    },
    {
      name: 'keywords',
      content: t('transactions.meta.keywords'),
    },
  ],
})

const transactionsStore = useTransactionsStore()
const transactions = computed(() => transactionsStore.transactions)

// Initialize store on mount
onMounted(() => {
  transactionsStore.init()
})

const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(10)

const filteredTransactions = computed(() => {
  const transactionsArray = [...transactions.value]

  if (!searchQuery.value) {
    return transactionsArray
  }

  const query = searchQuery.value.toLowerCase()
  return transactionsArray.filter((transaction) => {
    const rawCategory = transaction.category.toLowerCase()
    const translatedCategory = t('categories.' + rawCategory.replace(/ & | /g, '_')).toLowerCase()
    return transaction.description.toLowerCase().includes(query)
      || rawCategory.includes(query)
      || translatedCategory.includes(query)
  })
})

const handleEditTransaction = (transaction: { id?: string | number }) => {
  if (!transaction.id) return
  navigateTo(`/dashboard/transactions/${transaction.id}`)
}

const handleDeleteTransaction = async (transaction: { id?: string | number }) => {
  if (!transaction.id) return
  await transactionsStore.deleteTransaction(transaction.id as string)
}

const handleNewTransactionClick = () => {
  navigateTo('/dashboard/transactions/new')
}

const handleLoadDummyData = () => {
  transactionsStore.generateMockData()
}
</script>

<style lang="scss"></style>
