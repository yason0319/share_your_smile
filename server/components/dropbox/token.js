// token management class
class Token {
  constructor() {
    this.access_token = ''
  }

  getAccessToken() {
    return this.access_token;
  }

  setAccessToken(token) {
    this.access_token = token
  }
}

var token = new Token();

module.exports = token