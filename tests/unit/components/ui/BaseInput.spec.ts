import { mount } from '@vue/test-utils'
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest'
import BaseInput from '@/components/ui/BaseInput.vue'
import { createPinia } from 'pinia'

vi.mock('@nuxt/icon', () => ({
  default: () => ({ render: () => null }),
}))

describe('BaseInput', () => {
  beforeEach(() => {
    vi.resetModules()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders label and placeholder', () => {
    const wrapper = mount(BaseInput, {
      props: { label: 'Test Label', name: 'test', placeholder: 'Test Placeholder' },
      global: { plugins: [createPinia()], stubs: { NuxtIcon: () => null } },
    })
    expect(wrapper.text()).toContain('Test Label')
    expect(wrapper.find('input').attributes('placeholder')).toBe('Test Placeholder')
  })

  it('supports v-model', async () => {
    let value: string | number | undefined = ''
    const wrapper = mount(BaseInput, {
      props: {
        'name': 'test',
        'modelValue': value,
        'onUpdate:modelValue': (v: string | number | undefined) => { value = v },
      },
    })
    const input = wrapper.find('input')
    await input.setValue('abc')
    expect(value).toBe('abc')
  })

  it('shows left and right icons', () => {
    const wrapper = mount(BaseInput, {
      props: { name: 'test', leftIcon: 'tabler:user', rightIcon: 'tabler:eye' },
      global: { stubs: { NuxtIcon: true } },
    })
    expect(wrapper.html()).toContain('tabler:user')
    expect(wrapper.html()).toContain('tabler:eye')
  })
})
