<template>
  <nav
    class="inline-flex items-center gap-2 select-none px-4"
    aria-label="Pagination"
  >
    <BaseButton
      size="sm"
      variant="secondary"
      :disabled="currentPage === 1"
      :aria-label="$t('pagination.previous')"
      class="min-w-[2.5rem]"
      @click="$emit('update:page', currentPage - 1)"
    >
      <span aria-hidden="true">&laquo;</span>
    </BaseButton>
    <BaseButton
      v-for="innerPage in pages"
      :key="innerPage"
      size="sm"
      variant="primary"
      :aria-current="page === innerPage ? 'page' : undefined"
      :class="[page === innerPage ? 'font-bold' : '']"
      :disabled="page === innerPage"
      class="min-w-[2.5rem]"
      @click="$emit('update:page', innerPage)"
    >
      {{ innerPage }}
    </BaseButton>
    <BaseButton
      size="sm"
      variant="secondary"
      :disabled="currentPage === totalPages"
      :aria-label="$t('pagination.next')"
      class="min-w-[2.5rem]"
      @click="$emit('update:page', currentPage + 1)"
    >
      <span aria-hidden="true">&raquo;</span>
    </BaseButton>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps<{
  page: number
  pageSize: number
  total: number
}>()

const _emit = defineEmits<{
  (e: 'update:page', page: number): void
}>()

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)))
const currentPage = computed(() => Math.min(Math.max(1, props.page), totalPages.value))

const pages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>
