import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import BaseSelect from '@/components/ui/BaseSelect.vue'

describe('BaseSelect', () => {
  it('renders label and placeholder', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        label: 'Test Label',
        name: 'test',
        placeholder: 'Select an option',
        options: ['A', 'B'],
      },
    })
    expect(wrapper.text()).toContain('Test Label')
    expect(wrapper.find('option:disabled').text()).toBe('Select an option')
  })

  it('renders options and supports v-model', async () => {
    const wrapper = mount(BaseSelect, {
      props: {
        name: 'test',
        options: [
          { label: 'Option 1', value: '1' },
          { label: 'Option 2', value: '2' },
        ],
        modelValue: '1',
        ['onUpdate:modelValue']: (v: string | undefined): void => { wrapper.setProps({ modelValue: v }) },
      },
    })
    const select = wrapper.find('select')
    expect(select.findAll('option').length).toBe(2)
    await select.setValue('2')
    expect((wrapper.props() as Record<string, unknown>)['modelValue']).toBe('2')
  })

  it('shows error message', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        name: 'test',
        options: ['A'],
        error: 'Error!',
      },
    })
    expect(wrapper.text()).toContain('Error!')
    expect(wrapper.find('.form-error-message').exists()).toBe(true)
  })

  it('can be disabled', () => {
    const wrapper = mount(BaseSelect, {
      props: {
        name: 'test',
        options: ['A'],
        disabled: true,
      },
    })
    expect(wrapper.find('select').attributes('disabled')).toBeDefined()
  })
})
