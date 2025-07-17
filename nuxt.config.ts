import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vee-validate/nuxt',
    '@nuxt/icon',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
  ],
  ssr: true,
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Budget-Wise',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          id: 'description',
          name: 'description',
          content: 'Application for managing your home budget',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || '/api',
    },
  },
  compatibilityDate: '2025-05-15',
  nitro: {
    preset: 'static',
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      'autoprefixer': {},
    },
  },
  eslint: {
    config: { stylistic: true },
    checker: false,
  },
  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
    strategy: 'no_prefix',
    defaultLocale: 'en',
    lazy: true,
    langDir: 'locales',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
        language: 'en-US',
      },
      {
        code: 'pl',
        iso: 'pl-PL',
        name: 'Polish',
        file: 'pl.json',
        language: 'pl-PL',
      },
    ],
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  },
})
