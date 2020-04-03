// token management class
class Token {
  constructor() {
    this.access_token = ''
  }

  getAccessToken() {
    // console.log('token is ' + this.access_token)
    return this.access_token;
  }

  setAccessToken(token) {
    this.access_token = token
    console.log('set token : ' + this.access_token)
  }
}

var tokenclass = new Token();

module.exports = {
  token: tokenclass
}