<template>
  <BaseCard
    :rounded="'lg'"
    :bg="'white'"
    class="min-w-72 flex-1 gap-2"
  >
    <p class="text-primaryText text-base font-medium leading-normal">
      {{ $t('dashboard.monthlyComparison') }}
    </p>
    <div class="h-64">
      <canvas ref="chartCanvas" />
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import type { ChartItem, ChartDataset, TooltipItem } from 'chart.js/auto'
import { useI18n } from 'vue-i18n'
import { useCurrencyFormatter } from '~/composables/useCurrencyFormatter'
import BaseCard from '~/components/ui/BaseCard.vue'

const { t: $t, locale } = useI18n()
const { formatCurrency } = useCurrencyFormatter()

const props = defineProps<{
  incomes: Array<{ date: string, amount: number }>
  expenses: Array<{ date: string, amount: number }>
  year?: number // Optional, for filtering and labeling
}>()

const chartCanvas = ref<ChartItem | null>(null)
let chart: Chart | null = null

const _getYearRange = (items: Array<{ date: string }>) => {
  if (!items.length) return [new Date().getFullYear()]
  const years = items.map(i => new Date(i.date).getFullYear())
  return [Math.min(...years), Math.max(...years)]
}

const prepareChartData = () => {
  const chartYear = props.year || new Date().getFullYear()
  // Filter data for the selected year
  const incomes = props.incomes.filter(i => new Date(i.date).getFullYear() === chartYear)
  const expenses = props.expenses.filter(e => new Date(e.date).getFullYear() === chartYear)
  // Prepare labels as 'Jan 2024', ...
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(chartYear, i)
    return d.toLocaleString(locale.value, { month: 'short', year: 'numeric' })
  })
  const incomeByMonth = Array(12).fill(0)
  const expenseByMonth = Array(12).fill(0)
  incomes.forEach((income) => {
    const month = new Date(income.date).getMonth()
    incomeByMonth[month] += income.amount
  })
  expenses.forEach((expense) => {
    const month = new Date(expense.date).getMonth()
    expenseByMonth[month] += expense.amount
  })
  return {
    labels: months,
    datasets: [
      {
        type: 'bar' as const,
        label: $t('dashboard.chartTooltips.income'),
        data: incomeByMonth,
        backgroundColor: '#4a7c59',
        borderColor: '#3a6a49',
        borderWidth: 1,
        order: 1,
      },
      {
        type: 'bar' as const,
        label: $t('dashboard.chartTooltips.expense'),
        data: expenseByMonth,
        backgroundColor: '#d33f49',
        borderColor: '#c32f39',
        borderWidth: 1,
        order: 1,
      },
      {
        type: 'line' as const,
        label: $t('dashboard.chartTooltips.income') + ' Trend',
        data: incomeByMonth,
        borderColor: '#4a7c59',
        borderWidth: 2,
        fill: false,
        pointRadius: 0,
        order: 0,
      },
      {
        type: 'line' as const,
        label: $t('dashboard.chartTooltips.expense') + ' Trend',
        data: expenseByMonth,
        borderColor: '#d33f49',
        borderWidth: 2,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0,
        order: 0,
      },
    ] as ChartDataset[],
  }
}

onMounted(() => {
  if (chartCanvas.value) {
    chart = new Chart(chartCanvas.value, {
      type: 'bar',
      data: prepareChartData(),
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f4f1',
            },
            ticks: {
              callback: (value: string | number) => formatCurrency(Number(value)),
            },
          },
          x: {
            grid: {
              display: false,
            },
            stacked: false,
          },
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              padding: 20,
            },
          },
          tooltip: {
            callbacks: {
              label: (context: TooltipItem<'bar'>) => {
                const label = context.dataset.label
                const value = context.parsed.y
                return `${label}: ${formatCurrency(value)}`
              },
              footer: (context: TooltipItem<'bar'>[]) => {
                let income = null
                let expense = null
                context.forEach((item) => {
                  if (item.dataset.label === $t('dashboard.chartTooltips.income')) {
                    income = item.parsed.y
                  }
                  else if (item.dataset.label === $t('dashboard.chartTooltips.expense')) {
                    expense = item.parsed.y
                  }
                })
                if (income !== null && expense !== null) {
                  const net = income - expense
                  const netLabel = net >= 0
                    ? $t('dashboard.chartTooltips.netProfit')
                    : $t('dashboard.chartTooltips.netLoss')
                  return `${netLabel}: ${formatCurrency(Math.abs(net))}`
                }
                return ''
              },
            },
          },
        },
      },
    })
  }
})

watch(() => [props.incomes, props.expenses], () => {
  if (chart) {
    chart.data = prepareChartData()
    chart.update()
  }
}, { deep: true })
</script>
