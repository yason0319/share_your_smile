/* eslint-disable no-undef */
import { mount } from '@vue/test-utils'
import NewPost from '@/components/NewPost'

jest.useFakeTimers()

describe('NewPost Componet', () => {
  let wrapper

  var newImages = (
    [
      {
        src: 'John Doe - 2.jpg',
        title: 'John Doe',
        visible: false,
        post_no: 1
      },
      {
        src: 'John Doe - 2.jpg',
        title: 'John Doe',
        visible: false,
        post_no: 2
      }
    ]
  )

  beforeEach(() => {
    wrapper = mount(NewPost, {
      mocks: {
        $images_url: '/image_url',
        $images_list_url: '/images_list_url'
      }
    })
  })

  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('show new post', () => {
    var postNum = newImages.length
    wrapper.vm.setNewImagesInfo(newImages)
    jest.runAllTimers()
    do {
      if ((wrapper.vm.$data.nowShowImageNum === postNum - 1) && (wrapper.vm.$data.isShowNewImage === false)) {
        wrapper.vm.afterLeave()
        jest.runAllTimers()
      }
      postNum--
    } while (postNum >= 0)
    expect(wrapper.emitted('startSlideShow')).toBeTruthy()
  })
})
