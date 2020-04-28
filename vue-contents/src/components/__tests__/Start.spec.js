/* eslint-disable no-undef */
import { createLocalVue, shallowMount } from '@vue/test-utils'
import Start from '@/components/Start'

jest.useFakeTimers()

describe('Start Component', () => {
  let wrapper
  const router = { push: jest.fn() }

  beforeEach(() => {
    wrapper = shallowMount(Start, {
      mocks: { $router: router }
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  // it('pushes to home', () => {
  //   expect(router.push).toBeCalledWith('/slide_show')
  // })

  it('start countdown', async () => {
    wrapper.find('.opening_content').trigger('click')
    jest.runAllTimers()
    expect(router.push).toHaveBeenCalledWith({path: '/slide_show'})
    // expect(wrapper.find('.start_phrase').text()).toBe('0')
    expect(wrapper.vm.$data.dispCount).toBe('Start!')
  })
})
