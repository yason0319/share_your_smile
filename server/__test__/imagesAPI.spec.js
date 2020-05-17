'use strict'
const app = require('../app')
const request = require('supertest')

// モックファイルを指定するのではなく、もとのファイルを指定する。
// モックファイルとの紐付けはjestがやってくれる。
jest.mock('../components/dropbox/cusDropbox')
// jest.mock('../components/images/images')

const agent = request.agent(app)

jest.mock('fs')

describe('images api', () => {

  const MOCK_FILE_INFO = {
    './assets/json/images.json': '{"test":"json"}',
    './assets/json/contest.json': '{"test":"contest"}',
    './assets/tmp_image/John Doe 1.jpg': 'john doe 1',
    './assets/tmp_image/John Doe 2.jpg': 'john doe 2',
    './assets/json/test.txt': 'jest is complicated!'
  };

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockFiles(MOCK_FILE_INFO);
  })

  afterEach(() => {
    require('fs').__removeMockFiles()
  })

  it('images post', async () => {
    const response = await agent.post('/images/')
    // console.log(response.body)
    expect(response.statusCode).toBe(200)
    expect(response.body.reply).toBe('hello')
  })

  it('test post', async () => {
    const response = await agent.post('/images/test')
    expect(response.statusCode).toBe(200)
    expect(response.body.reply).toBe('this only test')
  })

  it('get list', async () => {
    const response = await agent.post('/images/get_list')
    expect(response.body.test).toBe('json')
    expect(response.statusCode).toBe(200)
  })

  it('get list contest', async () => {
    const response = await agent.post('/images/contest/get_list')
    expect(response.statusCode).toBe(200)
  })

  it('get', async () => {
    // リストデータを登録しておく必要がある
    require('../components/images/images').getList()
    const response = await agent.post('/images/get')
    expect(response.statusCode).toBe(200)
  })
})

describe('error cases', () => {
  const MOCK_FILE_INFO2 = {
    './assets/': 'undefined'
  }

  beforeEach(() => {
    // Set up some mocked out file info before each test
    require('fs').__setMockFiles(MOCK_FILE_INFO2)
  })

  afterEach(() => {
    require('fs').__removeMockFiles()
  })
  
  it('get list', async () => {
    const response = await agent.post('/images/get_list')
    // console.log(response.body)
    expect(response.statusCode).toBe(500)
  })

  it('get list contest', async () => {
    require('fs').__removeMockFiles()
    const response = await agent.post('/images/contest/get_list')
    expect(response.statusCode).toBe(500)
  })

  it('get', async () => {
    const response = await agent.post('/images/get')
    expect(response.statusCode).toBe(200)
  })
})