const images = require('../images')
const testRequest = require('supertest')

// ここではexpressルーターのテストしちゃいかん。UTのみ
describe('test 1', () => {
  it('test func', () => {
    expect(images.testfunc(1,2)).toBe(3)
  })
})

// describe('image api', () => {
//   it('post', async () => {
//     const response = await testRequest(images.router).post('/')
//     console.log(response.statusCode)
//     expect(response.statusCode).toBe(200)
//   })

//   it('test', async () => {
//     const response = await testRequest(images.router).post('/test')
//     console.log(response)
//   })
// })