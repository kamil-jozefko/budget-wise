import { config } from '@vue/test-utils'

config.global.stubs = config.global.stubs || {}
config.global.stubs.RouterLink = {
  name: 'RouterLink',
  template: '<a><slot /></a>',
  props: ['to'],
}
config.global.stubs.NuxtLink = {
  name: 'NuxtLink',
  props: ['to'],
  template: '<a :href="to"><slot /></a>',
}

config.global.mocks = {
  $t: () => '',
  $tc: () => '',
  $te: () => true,
  $d: (date: Date) => date.toLocaleDateString(),
  $n: (num: number) => num.toString(),
}
