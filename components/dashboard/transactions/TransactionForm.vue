<template>
  <form
    class="flex flex-col gap-3 max-w-full sm:max-w-[480px] mx-auto"
    @submit.prevent="handleSubmit"
  >
    <div class="flex flex-wrap flex-col gap-4">
      <BaseInput
        v-model="form.amount"
        name="amount"
        type="number"
        step="0.01"
        min="0"
        :label="t('transactions.amount')"
        :placeholder="t('transactions.amount')"
        :error="errors.amount"
        required
      />

      <BaseInput
        v-model="form.description"
        name="description"
        type="text"
        :label="t('transactions.description')"
        :placeholder="t('transactions.description')"
        :error="errors.description"
        required
      />

      <BaseInput
        v-model="form.date"
        name="date"
        type="date"
        :label="t('transactions.date')"
        :error="errors.date"
        required
        :min="minDate"
        :max="maxDate"
      />

      <div class="flex gap-4 w-full">
        <BaseSelect
          v-model="form.type"
          name="type"
          :label="t('transactions.type')"
          :options="['INCOME', 'EXPENSE']"
          :error="errors.type"
          required
        />
        <BaseSelect
          v-model="form.category"
          name="category"
          :label="t('transactions.category')"
          :options="typeCategories"
          :error="errors.category"
          required
        />
      </div>
      <div class="flex flex-row gap-4">
        <BaseButton
          type="submit"
          :label="submitLabel"
          :loading="loading"
          :disabled="!isFormValid"
          variant="primary"
          size="md"
        />
        <BaseButton
          variant="secondary"
          size="md"
          :label="t('transactions.cancel')"
          @click="handleCancel"
        />
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseInput from '~/components/ui/BaseInput.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import { TRANSACTION_CATEGORIES } from '~/types/transaction'
import type { Transaction, TransactionFormData } from '~/types/transaction'
import { useValidation } from '~/composables/useValidation'

const { t } = useI18n()
const { isDateInRange } = useValidation()

const props = withDefaults(
  defineProps<{
    transaction?: Transaction | null
    loading?: boolean
  }>(),
  {
    transaction: null,
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'submit', data: TransactionFormData): void
  (e: 'cancel'): void
}>()

const form = reactive<TransactionFormData & { id?: string }>({
  amount: 0,
  description: '',
  date: new Date().toISOString().split('T')[0],
  type: 'EXPENSE',
  category: 'Other',
  id: undefined,
})

const errors = reactive({
  amount: '',
  description: '',
  date: '',
  type: '',
  category: '',
})

const minDate = '2000-01-01'
const maxDate = new Date().toISOString().split('T')[0]

const typeCategories = computed(() => {
  const typeKey = form.type as keyof typeof TRANSACTION_CATEGORIES
  return TRANSACTION_CATEGORIES[typeKey].map(cat => ({
    value: cat,
    label: t('categories.' + cat.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')),
  }))
})

const submitLabel = computed(() =>
  props.transaction?.id ? t('transactions.update') : t('transactions.add'),
)

watch(
  () => props.transaction,
  (transaction) => {
    if (!transaction) return
    if (transaction.id === form.id) return // do not overwrite if it is the same transaction
    form.amount = Number(transaction.amount)
    form.description = transaction.description ?? ''
    form.date = transaction.date ? transaction.date.slice(0, 10) : new Date().toISOString().slice(0, 10)
    form.type = transaction.type as 'INCOME' | 'EXPENSE'
    form.category = transaction.category as typeof form.category
    form.id = transaction.id
  },
  { immediate: true },
)

const validateForm = () => {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  if (!form.amount) {
    errors.amount = t('transactions.amountRequired')
    isValid = false
  }
  else if (form.amount <= 0) {
    errors.amount = t('transactions.amountPositive')
    isValid = false
  }

  if (!form.description.trim()) {
    errors.description = t('transactions.descriptionRequired')
    isValid = false
  }
  else if (form.description.trim().length < 3) {
    errors.description = t('transactions.descriptionMin')
    isValid = false
  }

  if (!form.date) {
    errors.date = t('transactions.dateRequired')
    isValid = false
  }
  else if (!isDateInRange(form.date, minDate, maxDate)) {
    if (form.date < minDate) {
      errors.date = t('transactions.dateTooEarly', { min: minDate })
    }
    else if (form.date > maxDate) {
      errors.date = t('transactions.dateTooLate', { max: maxDate })
    }
    else {
      errors.date = t('transactions.dateInvalidRange', { min: minDate, max: maxDate })
    }
    isValid = false
  }

  if (!form.type) {
    errors.type = t('transactions.typeRequired')
    isValid = false
  }

  if (!form.category) {
    errors.category = t('transactions.categoryRequired')
    isValid = false
  }

  return isValid
}

const isFormValid = computed(() =>
  form.amount > 0
  && form.description.trim()
  && form.date
  && form.type
  && form.category,
)

const handleSubmit = () => {
  if (validateForm()) {
    const dataToSend: TransactionFormData = {
      ...form,
      date: new Date(form.date).toISOString(),
      type: form.type,
    }
    emit('submit', dataToSend)
  }
}

const handleCancel = () => {
  emit('cancel')
}

const resetForm = () => {
  form.amount = 0
  form.description = ''
  form.date = new Date().toISOString().split('T')[0]
  form.type = 'EXPENSE'
  form.category = 'Other'

  Object.keys(errors).forEach((key) => {
    errors[key as keyof typeof errors] = ''
  })
}

defineExpose({
  resetForm,
})
</script>
