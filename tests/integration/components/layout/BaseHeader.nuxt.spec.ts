import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import BaseHeader from '~/components/layout/BaseHeader.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'

describe('BaseHeader.vue', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    wrapper = mount(BaseHeader, {
      props: {
        title: 'Test Title',
      },
      global: {
        mocks: {
          $t: (key: string) => key,
        },
        components: {
          BaseSelect,
        },
      },
    })
  })

  it('renders the provided title', () => {
    expect(wrapper.text()).toContain('Test Title')
  })
})
