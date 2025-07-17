import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseButton from '@/components/ui/BaseButton.vue'

describe('BaseButton', () => {
  it('renders label', () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Click Me' },
    })
    expect(wrapper.text()).toContain('Click Me')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton, {
      props: { label: 'Click Me' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders slot content', () => {
    const wrapper = mount(BaseButton, {
      slots: { default: '<span>Slot Content</span>' },
    })
    expect(wrapper.html()).toContain('Slot Content')
  })
})
