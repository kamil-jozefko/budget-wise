<template>
  <BaseCard
    :rounded="'xl'"
    :bg="'#f2f4f1'"
    class="min-w-[158px] flex-1 gap-2"
  >
    <p class="text-primaryText text-base font-medium leading-normal">
      {{ title }}
    </p>
    <p
      class="tracking-light text-2xl font-bold leading-tight"
      :class="amountColorClass"
    >
      {{ formattedAmount }}
    </p>
  </BaseCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCurrencyFormatter } from '~/composables/useCurrencyFormatter'
import BaseCard from '~/components/ui/BaseCard.vue'

interface Props {
  title: string
  amount: number
  isPositive?: boolean | null
}

const props = withDefaults(defineProps<Props>(), {
  isPositive: null,
})

const { formatCurrency } = useCurrencyFormatter()
const formattedAmount = computed(() => {
  return formatCurrency(props.amount)
})

const amountColorClass = computed(() => {
  if (props.isPositive === null) {
    return 'text-[#131612]'
  }
  return props.isPositive ? 'text-income' : 'text-expense'
})
</script>
