import { mount } from '@vue/test-utils'
import BaseTable from '@/components/ui/BaseTable.vue'
import { describe, it, expect } from 'vitest'

describe('BaseTable', () => {
  it('renders header, body, and pagination slots', () => {
    const wrapper = mount(BaseTable, {
      props: {
        rounded: 'lg',
        bg: 'white',
        border: true,
        borderColor: '#dee4dc',
      },
      slots: {
        header: '<th>Header</th>',
        body: '<tr><td>Row</td></tr>',
        pagination: '<div class="pagination">Pagination</div>',
      },
    })
    expect(wrapper.find('th').text()).toBe('Header')
    expect(wrapper.find('td').text()).toBe('Row')
    expect(wrapper.find('.pagination').text()).toBe('Pagination')
  })
})
