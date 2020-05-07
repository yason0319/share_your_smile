'use strict'

// const dbx = jest.genMockFromModule('../dropbox')

class Dropbox {
  constructor () {
    this.access_token = ''
  }

  getAccessTokenFromCode (url, code) {
    return 'testToken0304'
  }
  
  getAuthenticationUrl (url, state, code) {
    return 'state=' + state
  }

  setAccessToken (token) {
    this.access_token = token
  }

  usersGetCurrentAccount () {
    var account_details = {
      name: {
        display_name: 'John Doe'
      }
    }
    return account_details
  }

  filesListFolder(path) {
    var response = {
      entries: [
        {
          name: 'John Doe 1.jpg'
        },
        {
          name: 'John Doe 2.jpg'
        }
      ]
    }
    return new Promise((resolve, reject) => {
      resolve(response)
    })
  }

  filesDownload(path) {
    var response = {
      fileBinary: 'pepepe'
    }
    return new Promise((resolve, reject) => {
      resolve(response)
    })

  }
}

var dbx = new Dropbox()

module.exports = dbx