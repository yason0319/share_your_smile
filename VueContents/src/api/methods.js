import Api from './index'

export default {
  testPosting () {
    const item = { text: 'Success!' }
    return Api().post('/test', item)
  },
  // 他の処理も追加可能
  testPosting2 () {
    const item = { text: 'failure ja nai!' }
    return Api().post('/test2', item)
  }
}
