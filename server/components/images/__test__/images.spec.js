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
    './assets/tmp_image/John Doe 2.jpg': 'john doe 2',
    './assets/json/test.txt': 'jest is complicated!'
  };

  // beforeEach(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  // });

  it('start loop', async () => {
    images.mainLoop_start()
  })
})