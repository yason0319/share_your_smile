'use strict'

// const dbx = jest.genMockFromModule('../dropbox')

class Dropbox {
  constructor () {
    this.access_token = ''
  }

  // 成功ケースを走らせると、cacheが消されてしまうので、まず失敗ケースをテストする
  getAccessTokenFromCode (url, code) {
    return new Promise((resolve, reject) => {
      if (global.__dbx__.token) {
        resolve('testToken0304')
      } else {
        reject('pepepe')
      }
    })
  }
  
  getAuthenticationUrl (url, state, code) {
    return 'state=' + state
  }

  setAccessToken (token) {
    this.access_token = token
  }

  // エラーケースのテストは成功ケースのあとに実施する。
  // 二回目の呼び出し時は、rejectで結果を返すようにする。
  usersGetCurrentAccount () {
    var account_details = {
      name: {
        display_name: 'John Doe'
      }
    }
    return new Promise((resolve, reject) => {
      if (global.__dbx__.user) {
        resolve(account_details)
      } else {
        reject('error popopo')
      }
    })
  }

  filesListFolder(path) {
    var response = {
      entries: [
        {
          name: 'John Doe 1.jpg'
        },
        {
          name: 'John Doe 2.jpg'
        },
        {
          name: 'John Doe 3.jpg'
        }
      ]
    }
    return new Promise((resolve, reject) => {
      if (global.__dbx__.fileList) {
        resolve(response)
      } else {
        reject('unkokko')
      }
    })
  }

  filesDownload(path) {
    var response = {
      fileBinary: 'pepepe'
    }
    return new Promise((resolve, reject) => {
      if (global.__dbx__.download) {
        global.__dbx__.download = false
        resolve(response)
      } else {
        global.__dbx__.download = true
        reject('unkokko')
      }
    })

  }
}

var dbx = new Dropbox()

module.exports = dbx