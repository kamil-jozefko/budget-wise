<template>
  <div class="flex flex-col w-full max-w-5xl mx-auto gap-6">
    <BaseHeader :title="$t('dashboard.title')" />
    <div
      v-if="filteredTransactions.length > 0"
      class="flex gap-4 flex-wrap"
    >
      <BaseButton
        v-for="preset in presets"
        :key="preset.range"
        variant="secondary"
        size="sm"
        class="px-4 py-2"
        :class="{
          'font-bold': isPresetActive(preset.range),
        }"
        :disabled="!canUseQuickFilters"
        @click="canUseQuickFilters ? applyPreset(preset.range) : null"
      >
        {{ $t(preset.label) }}
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="sm"
        class="px-4 py-2"
        @click="resetFilters"
      >
        {{ $t('dashboard.resetFilters') }}
      </BaseButton>
    </div>
    <div
      v-if="filteredTransactions.length > 0"
      class="flex flex-row items-center gap-4"
    >
      <label class="text-base font-medium transition-colors duration-300 text-slate-800">{{
        $t('dashboard.currentYearLabel') }}</label>
      <select
        id="year-select"
        v-model="selectedYear"
        class="form-input rounded-xl border border-[#dfe3dd] px-4 py-2 h-12 min-w-[120px] text-base font-normal text-slate-800 focus:border-[#dfe3dd] focus:outline-0 focus:ring-0 bg-white transition-colors duration-300"
      >
        <option
          v-for="year in availableYears"
          :key="year"
          :value="year"
        >
          {{ year }}
        </option>
      </select>
    </div>
    <div class="flex flex-wrap gap-4">
      <StatsCard
        :title="$t('dashboard.totalIncome')"
        :amount="totalIncome"
      />
      <StatsCard
        :title="$t('dashboard.totalExpenses')"
        :amount="totalExpenses"
      />
      <StatsCard
        :title="$t('dashboard.currentBalance')"
        :amount="currentBalance"
        :is-positive="currentBalance >= 0"
      />
    </div>
    <div class="flex flex-col w-full">
      <MonthlyComparisonChart
        :incomes="filteredTransactions.filter(t => t.type === 'INCOME')"
        :expenses="filteredTransactions.filter(t => t.type === 'EXPENSE')"
        :year="chartYear"
      />
    </div>
    <div class="flex flex-col w-full">
      <RecentTransactionsPreview :transactions="recentTransactions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import MonthlyComparisonChart from '~/components/dashboard/MonthlyComparisonChart.vue'
import RecentTransactionsPreview from '~/components/dashboard/RecentTransactionsPreview.vue'
import StatsCard from '~/components/dashboard/StatsCard.vue'
import BaseHeader from '~/components/layout/BaseHeader.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import { useTransactionsStore } from '~/stores/transactions'
import type { Transaction } from '~/types/transaction'

definePageMeta({
  layout: 'dashboard-layout',
})

const transactionsStore = useTransactionsStore()

onMounted(() => {
  transactionsStore.init()
  transactionsStore.fetchStats()
  transactionsStore.fetchTransactions()
})

const getAllYears = (items: { date: string }[]) => {
  const years = Array.from(new Set(items.map(i => new Date(i.date).getFullYear())))
  return years.sort((a, b) => b - a)
}

const availableYears = computed(() => getAllYears(transactionsStore.transactions))
const selectedYear = ref(availableYears.value[0] || new Date().getFullYear())

const dateRange = ref<{ start: string | null, end: string | null }>({ start: null, end: null })

const presets = [
  { label: 'dashboard.presetThisMonth', range: { start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10), end: new Date().toISOString().slice(0, 10) } },
  { label: 'dashboard.presetLastMonth', range: (() => {
    const now = new Date()
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    return { start: firstDayLastMonth.toISOString().slice(0, 10), end: lastDayLastMonth.toISOString().slice(0, 10) }
  })() },
  { label: 'dashboard.presetThisYear', range: { start: new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10), end: new Date().toISOString().slice(0, 10) } },
]

function isPresetActive(range: { start: string, end: string }) {
  return dateRange.value.start === range.start && dateRange.value.end === range.end
}

const canUseQuickFilters = computed(() => transactionsStore.transactions.length > 0)

function applyPreset(range: { start: string, end: string }) {
  dateRange.value = { ...range }
}

function resetFilters() {
  dateRange.value = { start: null, end: null }
}

function filterByYear(txs: Transaction[]) {
  return txs.filter(t => new Date(t.date).getFullYear() === selectedYear.value)
}

const filteredTransactions = computed(() => {
  let txs = transactionsStore.transactions
  if (dateRange.value.start) {
    const startDate = dateRange.value.start
    txs = txs.filter(t => t.date.slice(0, 10) >= startDate)
  }
  if (dateRange.value.end) {
    const endDate = dateRange.value.end
    txs = txs.filter(t => t.date.slice(0, 10) <= endDate)
  }
  if (!dateRange.value.start && !dateRange.value.end) {
    txs = filterByYear(txs)
  }
  return txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const totalIncome = computed(() =>
  filteredTransactions.value
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0),
)

const totalExpenses = computed(() =>
  filteredTransactions.value
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0),
)

const currentBalance = computed(() => totalIncome.value - totalExpenses.value)

const recentTransactions = computed(() => {
  return filteredTransactions.value.slice(0, 5)
})

const chartYear = computed(() => selectedYear.value)

useHead({
  title: 'Dashboard - Budget App',
  meta: [
    { name: 'description', content: 'Overview of your financial health and budget management' },
  ],
})
</script>
