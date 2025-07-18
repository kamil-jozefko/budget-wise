import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: [
      'tests/unit/**/*.spec.ts',
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.spec.ts',
      'tests/integration/**/*.test.ts',
    ],
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'happy-dom',
      },
    },
    setupFiles: ['./tests/setup/global-stubs.ts'],
    coverage: {
      include: [
        'components/**/*.vue',
        'composables/**/*.ts',
        'stores/**/*.ts',
      ],
      reporter: ['text', 'html'],
    },
  },
})
