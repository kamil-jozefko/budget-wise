<template>
  <BaseTable>
    <template #header>
      <th class="table-column-date px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-800 w-[120px] sm:w-[200px] md:w-[300px] lg:w-[400px] text-xs sm:text-sm font-medium leading-normal transition-colors duration-300">
        {{ t('transactions.table.date') }}
      </th>
      <th class="table-column-description px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-800 w-[120px] sm:w-[200px] md:w-[300px] lg:w-[400px] text-xs sm:text-sm font-medium leading-normal transition-colors duration-300">
        {{ t('transactions.table.description') }}
      </th>
      <th class="table-column-category px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-800 w-[120px] sm:w-[200px] md:w-[300px] lg:w-[400px] text-xs sm:text-sm font-medium leading-normal transition-colors duration-300">
        {{ t('transactions.table.category') }}
      </th>
      <th class="table-column-type px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-800 w-[80px] sm:w-[120px] md:w-[200px] lg:w-[400px] text-xs sm:text-sm font-medium leading-normal transition-colors duration-300">
        {{ t('transactions.table.type') }}
      </th>
      <th class="table-column-amount px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-800 w-[80px] sm:w-[120px] md:w-[200px] lg:w-[400px] text-xs sm:text-sm font-medium leading-normal transition-colors duration-300">
        {{ t('transactions.table.amount') }}
      </th>
      <th class="table-column-actions px-2 sm:px-4 py-2 sm:py-3 text-left text-slate-800  w-[80px] text-xs sm:text-sm font-medium leading-normal transition-colors duration-300">
        {{ t('transactions.table.actions') || 'Actions' }}
      </th>
    </template>
    <template #body>
      <tr
        v-for="transaction in paginatedTransactions"
        :key="transaction.id"
        class="hover:bg-gray-50 transition-colors"
      >
        <td class="table-column-date h-[48px] sm:h-[72px] px-2 sm:px-4 py-1 sm:py-2 w-[120px] sm:w-[200px] md:w-[300px] lg:w-[400px] text-xs sm:text-sm font-normal leading-normal">
          {{ formatDate(transaction.date) }}
        </td>
        <td class="table-column-description h-[48px] sm:h-[72px] px-2 sm:px-4 py-1 sm:py-2 w-[120px] sm:w-[200px] md:w-[300px] lg:w-[400px] text-xs sm:text-sm font-normal leading-normal">
          {{ transaction.description }}
        </td>
        <td class="table-column-category h-[48px] sm:h-[72px] px-2 sm:px-4 py-1 sm:py-2 w-[120px] sm:w-[200px] md:w-[300px] lg:w-[400px] text-xs sm:text-sm font-normal leading-normal">
          {{ t(`categories.${transaction.category.toLowerCase()}`) }}
        </td>
        <td class="table-column-type h-[48px] sm:h-[72px] px-2 sm:px-4 py-1 sm:py-2 w-[80px] sm:w-[120px] md:w-[200px] lg:w-[400px] text-xs sm:text-sm font-normal leading-normal">
          {{ t(`transactions.types.${transaction.type.toLowerCase()}`) }}
        </td>
        <td
          class="table-column-amount h-[48px] sm:h-[72px] px-2 sm:px-4 py-1 sm:py-2 w-[80px] sm:w-[120px] md:w-[200px] lg:w-[400px] text-xs sm:text-sm font-normal leading-normal"
          :class="transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
        >
          {{ formatAmountWithSign(transaction.amount, transaction.type) }}
        </td>
        <td class="table-column-actions h-[48px] sm:h-[72px] px-2 sm:px-4 py-1 sm:py-2 w-[80px] flex gap-2 items-center">
          <button
            class="action-btn text-slate-800"
            aria-label="Edit transaction"
            type="button"
            @click="$emit('edit', transaction)"
          >
            <Icon
              name="tabler:edit"
              size="26"
              class=""
            />
          </button>
          <button
            class="action-btn"
            aria-label="Delete transaction"
            type="button"
            @click="$emit('delete', transaction)"
          >
            <Icon
              name="tabler:trash"
              size="26"
              class=""
            />
          </button>
        </td>
      </tr>
      <tr v-if="transactions.length === 0">
        <td
          colspan="6"
          class="h-[48px] sm:h-[72px] px-2 sm:px-4 py-1 sm:py-2 text-center text-xs sm:text-sm font-normal leading-normal"
        >
          {{ t('transactions.table.noData') }}
        </td>
      </tr>
    </template>
    <template #pagination>
      <BasePagination
        v-if="page && pageSize && total && total > pageSize"
        :page="page"
        :page-size="pageSize"
        :total="total"
        @update:page="emit('update:page', $event)"
      />
    </template>
  </BaseTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseTable from '~/components/ui/BaseTable.vue'
import BasePagination from '~/components/ui/BasePagination.vue'
import { useCurrencyFormatter } from '~/composables/useCurrencyFormatter'
import type { Transaction } from '~/types/transaction'

interface Props {
  transactions: Transaction[]
  page?: number
  pageSize?: number
  total?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'edit' | 'delete', transaction: Transaction): void
  (e: 'update:page', page: number): void
}>()

const { t } = useI18n()
const { formatCurrency } = useCurrencyFormatter()

const formatAmountWithSign = (amount: number, type: 'INCOME' | 'EXPENSE'): string => {
  const sign = type === 'INCOME' ? '+' : '-'
  return `${sign} ${formatCurrency(amount)}`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const paginatedTransactions = computed(() => {
  if (!props.page || !props.pageSize) return props.transactions
  const start = (props.page - 1) * props.pageSize
  return props.transactions.slice(start, start + props.pageSize)
})
</script>

<style lang="scss">
.table-column-date:first-child,
.table-column-description:first-child,
.table-column-category:first-child,
.table-column-type:first-child,
.table-column-amount:first-child,
.table-column-actions:first-child {
  border-top-left-radius: 0.75rem;
}
.table-column-actions:last-child {
  border-top-right-radius: 0.75rem;
}
thead th {
  font-weight: 700;
  letter-spacing: 0.01em;
  border-bottom: 1.5px solid #e5e7eb;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
tbody tr {
  transition: box-shadow 0.2s, background 0.2s;
}
tbody tr:hover {
  background: #f3f4f6;
  box-shadow: 0 2px 8px 0 rgba(60,60,60,0.06);
}
td {
  border-bottom: 1px solid #f1f5f9;
  background: transparent;
  font-size: 0.98rem;
  padding-top: 0.85rem;
  padding-bottom: 0.85rem;
}
td:first-child {
  border-left: none;
}
td:last-child {
  border-right: none;
  border-bottom: none;
}
@container(max-width:120px) {
  .table-column-date {
    display: none;
  }
}
@container(max-width:240px) {
  .table-column-description {
    display: none;
  }
}
@container(max-width:360px) {
  .table-column-category {
    display: none;
  }
}
.table-column-amount {
  white-space: nowrap;
  min-width: 90px;
  @media (max-width: 1024px) {
    font-size: 0.92rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    min-width: 72px;
  }
}
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 9999px;
  background: transparent;
  transition: background 0.15s, box-shadow 0.15s, color 0.15s;
  border: none;
  cursor: pointer;
  outline: none;
}
.action-btn:hover, .action-btn:focus {
  background: #f1f5f9;
  box-shadow: 0 1px 4px 0 rgba(60,60,60,0.08);
}
</style>
