'use strict'
const images = require('../images')
const request = require('supertest')

// モックファイルを指定するのではなく、もとのファイルを指定する。
// モックファイルとの紐付けはjestがやってくれる。
jest.mock('../../dropbox/cusDropbox')
jest.mock('python-shell')
jest.mock('fs')

jest.useFakeTimers()

describe('update images loop', () => {

  const MOCK_FILE_INFO = {
    './assets/json/images.json': 'console.log("file1 contents");',
    './assets/tmp_image/John Doe 1.jpg': 'john doe 1',
    // './assets/tmp_image/John Doe 2.jpg': 'john doe 2',
    './assets/json/test.txt': 'jest is complicated!'
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockFiles(MOCK_FILE_INFO)
    global.__dbx__.fileList = true
  })

  afterEach(() => {
    require('fs').__removeMockFiles()
  })

  it('start main loop', async () => {
    const spy = jest.spyOn(images, 'mainLoop')
      .mockImplementation(() => {
        return true
        // throw 'fuckin error'
      })
    const loopStart = images.mainLoop()
    await images.mainLoop_start()
    expect(spy).toHaveBeenCalled()

    spy.mockRestore()
  })

  it('main loop', async () => {
    await images.mainLoop()
    expect(setTimeout).toHaveBeenCalledTimes(1)
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000)
    
    // 次のループ実行時はエラーケースに倒す
    global.__dbx__.fileList = false
    jest.runOnlyPendingTimers()
  })

  it('python shell exec fail', async () => {
    // const {PythonShell} = require('python-shell')
    // PythonShell.__setCount(1)
    global.__pyshell__ = false
    try {
      await images.makeJsonSlideImage()
    } catch(err) {
      expect(err).toBe('error occured')
    }
    // expect(response).toThrowError('error occured')
  })
})

// describe('error cases', () => {
//   const MOCK_FILE_INFO2 = {
//     './assets/': 'undefined'
//   }

//   beforeEach(() => {
//     // Set up some mocked out file info before each test
//     require('fs').__setMockFiles(MOCK_FILE_INFO2)
//   })

//   afterEach(() => {
//     require('fs').__removeMockFiles()
//   })
  
//   it('get list', async () => {
//     await images.download()
//   })
// })