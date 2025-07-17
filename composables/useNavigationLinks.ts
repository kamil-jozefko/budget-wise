import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'

export function useNavigationLinks(): ComputedRef<Array<{ to: string, label: string, activeMatch: boolean }>> {
  const { t } = useI18n()
  const route = useRoute()
  return computed(() => [
    {
      to: '/dashboard/',
      label: t('navigation.dashboard'),
      activeMatch: route.path === '/dashboard' || route.path === '/dashboard/',
    },
    {
      to: '/dashboard/transactions/',
      label: t('navigation.transactions'),
      activeMatch: route.path.startsWith('/dashboard/transactions'),
    },
    {
      to: '/dashboard/profile',
      label: t('user.profile'),
      activeMatch: route.path.startsWith('/dashboard/profile'),
    },
  ])
}
