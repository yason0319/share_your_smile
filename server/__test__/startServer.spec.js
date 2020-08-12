'use strict'
const app = require('../app')
const request = require('supertest')
import imagesMock from '../components/images/images'

// モックファイルを指定するのではなく、もとのファイルを指定する。
// モックファイルとの紐付けはjestがやってくれる。
jest.mock('../components/dropbox/cusDropbox')

const agent = request.agent(app)
const subAgent = request.agent(app)
var state = ''

describe('start server', () => {

  const OLD_ENV = process.env;

  beforeEach(() => {
    global.__dbx__.token = true
    global.__dbx__.user = true
  })

  it('初回アクセス。OAuth認証のため、Dropboxへリダイレクトを行う', async function(done) {
    const response = await agent.get('/')
    state = response.text.split('state=')[1]
    expect(response.statusCode).toBe(302)
    done()
  });

  it('OAuth認証失敗：リダイレクトURLのクエリにerror_descriptionパラメータが付与される', async function(done) {
    var error_description = 'errordayo'
    var uri = '/auth?error_description=' + error_description
    const response = await agent.get(uri)
    expect(response.statusCode).toBe(500)
    expect(response.text).toContain(error_description)
    done()
  })

  it('OAuth認証失敗：セッションステートが誤っている', async function(done) {
    var wrongState = 'sample'
    var uri = '/auth?state=' + wrongState + '&code=sample'
    const response = await agent.get(uri)
    expect(response.statusCode).toBe(500)
    expect(response.text).toContain('session expired or invalid state')
    done()
  })

  it('OAuth認証失敗：クエリパラメータ不足', async function(done) {
    var uri = '/auth?state=' + state
    const response = await agent.get(uri)
    expect(response.statusCode).toBe(500)
    expect(response.text).toContain('there is no parameter code in query')
    done()
  })

  it('DropboxAPIアクセストークン取得失敗', async function(done) {
    var uri = '/auth?state=' + state + '&code=sample'
    global.__dbx__.token = false
    const response = await agent.get(uri)
    expect(response.statusCode).toBe(500)
    done()
  })

  it('DropBoxAPIアクセストークン取得成功', async function(done) {
    var uri = '/auth?state=' + state + '&code=sample'
    const response = await agent.get(uri)
    expect(response.statusCode).toBe(302)
    done()
  })

  it('キャッシュクリア後のリダイレクトアクセス', async function(done) {
    var uri = '/auth?state=' + state + '&code=sample'
    const response2 = await agent.get(uri)
    expect(response2.statusCode).toBe(500)
    done()
  })

  // 画像を取得するループ処理開始関数をモック化したい
  it('Share Your Smileサーバー起動', async function(done) {
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

  it('Share Your Smileサーバー起動失敗', async function(done) {
    global.__dbx__.user = false
    const spy = jest.spyOn(imagesMock, 'mainLoop_start')
      .mockImplementation(() => {
        return false
      })
    const loopStart = imagesMock.mainLoop_start()

    const response = await agent.get('/')
    expect(response.statusCode).toBe(500)
    expect(spy).toHaveBeenCalled()
    expect(loopStart).toBe(false)
    done()

    spy.mockRestore()
  })
})