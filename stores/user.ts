import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', {
  state: () => ({
    currency: 'zł' as 'zł' | '$',
  }),
  actions: {
    setCurrency(currency: 'zł' | '$') {
      this.currency = currency
    },
  },
})
