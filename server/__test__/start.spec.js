'use strict'
const app = require('../app')
const request = require('supertest')
import imagesMock from '../components/images/images'

// モックファイルを指定するのではなく、もとのファイルを指定する。
// モックファイルとの紐付けはjestがやってくれる。
jest.mock('../components/dropbox/cusDropbox')
// jest.mock('../components/images/images')

const agent = request.agent(app)

describe('start server', () => {
  var state = ''

  const OLD_ENV = process.env;

  it('redirect to dropbox for OAuth before start server', async function(done) {
    const response = await agent.get('/')
    state = response.text.split('state=')[1]
    expect(response.statusCode).toBe(302)
    done()
  });

  it('set AccessToken throught dropbox', async function(done) {
    var uri = '/auth?state=' + state + '&code=sample'
    const response = await agent.get(uri)
    expect(response.statusCode).toBe(302)
    done()
  })

  // 画像を取得するループ処理開始関数をモック化したい
  it('start server', async function(done) {
    // spyOn(Object, Methodname)だと、実際の関数も呼び出してしまう。
    // 呼び出したくない場合は、spyOn(Object, Methodname).mockImplementation(() => mockfunction)
    const spy = jest.spyOn(imagesMock, 'mainLoop_start')
      .mockImplementation(() => {
        return true
      })
    const loopStart = imagesMock.mainLoop_start()

    const response = await agent.get('/')
    expect(response.statusCode).toBe(302)
    expect(spy).toHaveBeenCalled()
    expect(loopStart).toBe(true)
    done()

    spy.mockRestore()
  })
})