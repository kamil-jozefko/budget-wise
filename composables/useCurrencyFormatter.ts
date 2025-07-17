import { useCurrencyStore } from '~/stores/user'

type CurrencyConfig = {
  symbol: string
  position: 'prefix' | 'suffix'
  decimalDigits: number
  decimalSeparator: string
  thousandsSeparator: string
}

const CURRENCY_CONFIGS: Record<string, CurrencyConfig> = {
  $: {
    symbol: '$',
    position: 'prefix',
    decimalDigits: 2,
    decimalSeparator: '.',
    thousandsSeparator: ',',
  },
  zł: {
    symbol: 'zł',
    position: 'suffix',
    decimalDigits: 2,
    decimalSeparator: ',',
    thousandsSeparator: ' ',
  },
}

export function useCurrencyFormatter(currencyOverride?: string) {
  const currencyStore = useCurrencyStore()
  const formatCurrency = (amount: number): string => {
    const currency = currencyOverride || currencyStore.currency
    const config = CURRENCY_CONFIGS[currency] || CURRENCY_CONFIGS.zł

    const formatted = amount.toFixed(config.decimalDigits)
      .replace('.', config.decimalSeparator)
      .replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator)

    return config.position === 'prefix'
      ? `${config.symbol}${formatted}`
      : `${formatted} ${config.symbol}`
  }

  return {
    formatCurrency,
  }
}
