'use strict'
const app = require('../app')
const request = require('supertest')

// モックファイルを指定するのではなく、もとのファイルを指定する。
// モックファイルとの紐付けはjestがやってくれる。
jest.mock('../components/dropbox/cusDropbox')

describe('start server', () => {
  var state = ''

  jest.mock('../routes/images')

  const MOCK_FILE_INFO = {
    './assets/json/images.json': 'console.log("file1 contents");',
    './assets/tmp_image/John Doe 1.jpg': 'john doe 1',
    './assets/tmp_image/John Doe 2.jpg': 'john doe 2'
  };

  const OLD_ENV = process.env;

  // beforeEach(() => {
  //   // Set up some mocked out file info before each test
  //   // require('fs').__setMockFiles(MOCK_FILE_INFO);

  //   // jest.resetModules() // this is important - it clears the cache
  //   // process.env = { ...OLD_ENV };
  //   // delete process.env.NODE_ENV;

  //   // process.env.SESSION_ID_SECRET = 'nandemoiiyo'
  //   // const testedModule = require('../../config/env').default

  // });

  // afterEach(() => {
  //   process.env = OLD_ENV;
  // });

  const agent = request.agent(app)

  it('redirect to dropbox for OAuth before start server', async function(done) {
    // console.log(dbx.getAccessTokenFromCode)
    
    console.log('start!!!!')
    const response = await agent.get('/')
    // console.log(response.header)
    state = response.text.split('state=')[1]
    console.log(state)
    expect(response.statusCode).toBe(302)
    done()
  });

  it('set AccessToken throught dropbox', async function(done) {
    // jest.spyOn(dbx, 'getAccessTokenFromCode')
    var uri = '/auth?state=' + state + '&code=sample'
    console.log(uri)
    const response = await agent.get(uri)
    // console.log(response.headers)
    expect(response.statusCode).toBe(302)
    done()
  })

  // 画像を取得するループ処理開始関数をモック化したい
  it('start server', async function(done) {
    const response = await agent.get('/')
    expect(response.statusCode).toBe(302)
    done()
  })
})

describe('images api', () => {
  it('images post', async () => {
    jest.mock('fs')
    const response = await request(app).post('/images/')
    expect(response.statusCode).toBe(200)
    expect(response.body.reply).toBe('hello')
  })

  it('test post', async () => {
    const response = await request(app).post('/images/test')
    expect(response.statusCode).toBe(200)
    expect(response.body.reply).toBe('this only test')
  })

  it('get list', async () => {
    const response = await request(app).post('/images/get_list')
    expect(response.statusCode).toBe(200)
  })

  it('get list contest', async () => {
    const response = await request(app).post('/images/contest/get_list')
    expect(response.statusCode).toBe(200)
  })

  it('get', async () => {
    const response = await request(app).post('/images/get')
    expect(response.statusCode).toBe(200)
  })

})