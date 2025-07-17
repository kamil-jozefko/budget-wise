import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`,
  ],
  purge: [],
  theme: {
    extend: {
      colors: {
        primaryText: '#131712',
        cardBorder: '#dee4dc',
        cardBg: '#f2f4f1',
        income: '#4a7c59',
        expense: '#d33f49',
        incomeDark: '#3a6a49',
        expenseDark: '#c32f39',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
