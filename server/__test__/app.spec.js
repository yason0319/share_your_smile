'use strict'
const app = require('../app')
const request = require('supertest')

// モックファイルを指定するのではなく、もとのファイルを指定する。
// モックファイルとの紐付けはjestがやってくれる。
// jest.mock('fs')
jest.mock('../components/cusDropbox')

describe('image api', () => {
  var state = ''

  const agent = request.agent(app)

  // const MOCK_FILE_INFO = {
  //   '/path/to/file1.js': 'console.log("file1 contents");',
  //   '/path/to/file2.txt': 'file2 contents',
  // };

  // beforeEach(() => {
  //   // Set up some mocked out file info before each test
  //   require('fs').__setMockFiles(MOCK_FILE_INFO);
  // });

  it('redirect to dropbox for OAuth before start server', async function(done) {
    // console.log(dbx.getAccessTokenFromCode)
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

  it('start server', async function(done) {
    const response = await agent.get('/')
    expect(response.statusCode).toBe(302)
    done()
  })

  it('images post', async () => {
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

  // it('OAuth start with token', () => {
  //   var req = request(app).get('/')
  //   req.session.token = 'hogehoge'
  //   req.expect('Content-Type', /json/)
  //     .expect(200)
  //     .end(function (err, res) {
  //       expect(res.statusCode).toBe(302)
  //   })
  // })
})