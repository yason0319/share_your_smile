/* eslint-disable no-undef */
import { shallowMount } from '@vue/test-utils'
import SlideShow from '@/components/SlideShow'

jest.useFakeTimers()

var postImages =
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

var newImage =
  {
    src: 'John Doe - 3.jpg',
    title: 'John Doe',
    visible: false,
    post_no: 3
  }

var newImage2 =
  {
    src: 'John Doe - 4.jpg',
    title: 'John Doe',
    visible: false,
    post_no: 4
  }

function generateDummyResponse (data) {
  return Promise.resolve({
    ok: true,
    status: 200,
    json: () => {
      return data
    }
  })
}

const NewPostStub = {
  render: () => {},
  methods: {
    setNewImagesInfo: () => {}
  }
}

describe('SlideShow Component post images less than show number', () => {
  let wrapper

  wrapper = shallowMount(SlideShow, {
    mocks: {
      $images_url: '/image_url',
      $images_list_url: '/images_list_url'
    },
    stubs: {
      'new-post': NewPostStub
    }
  })
  fetch.resetMocks()

  it('is a Vue instance', async () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('get image data', async () => {
    const dummyResponse = generateDummyResponse(postImages)
    fetch.mockImplementation(() => dummyResponse)
    await wrapper.vm.getImageJson()
  })

  it('get image data that is same as last time', async () => {
    const dummyResponse = generateDummyResponse(postImages)
    fetch.mockImplementation(() => dummyResponse)
    await wrapper.vm.getImageJson()
  })

  it('get image data that includes new image data', async () => {
    postImages.push(newImage)
    const dummyResponse = generateDummyResponse(postImages)
    fetch.mockImplementation(() => dummyResponse)
    await wrapper.vm.getImageJson()
  })

  it('change slide image', () => {
    wrapper.vm.changeSlide()
  })

  it('beforeDestroy', () => {
    wrapper.destroy()
  })
})

describe('SlideShow Component post images over show number', () => {
  let wrapper

  wrapper = shallowMount(SlideShow, {
    mocks: {
      $images_url: '/image_url',
      $images_list_url: '/images_list_url'
    },
    stubs: {
      'new-post': NewPostStub
    }
  })
  fetch.resetMocks()

  it('is a Vue instance', async () => {
    wrapper.vm.$data.showNumber = 2
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('get image over show number', async () => {
    wrapper.vm.$data.showNumber = 2
    const dummyResponse = generateDummyResponse(postImages)
    fetch.mockImplementation(() => dummyResponse)
    await wrapper.vm.getImageJson()
  })

  it('change slide image', () => {
    wrapper.vm.changeSlide()
    jest.runOnlyPendingTimers()
    console.log(wrapper.vm.$data.showNum)
    // jest.runAllTimers()
  })

  it('add post image', async () => {
    postImages.push(newImage2)
    const dummyResponse = generateDummyResponse(postImages)
    fetch.mockImplementation(() => dummyResponse)
    await wrapper.vm.getImageJson()
  })

  it('no loop destroy', () => {
    wrapper.vm.$data.slideLoop = null
    wrapper.vm.$data.newPostLoop = null
    wrapper.destroy()
  })
})
