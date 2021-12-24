import { mount } from '@vue/test-utils'
import BaseButton from '@/components/Base/Button/index.vue'
import BaseInputText from '@/components/Base/InputText/index.vue'

describe('Base Button', () => {
  test('is a Base Button', () => {
    const wrapper = mount(BaseButton)
    expect(wrapper.vm).toBeTruthy()
  })
})

describe('Base Input Text', () => {
  test('is a Base Input Text', () => {
    const wrapper = mount(BaseInputText)
    expect(wrapper.vm).toBeTruthy()
  })
})
