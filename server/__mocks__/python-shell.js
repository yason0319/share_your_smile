'use strict'

// const {PythonShell} = jest.genMockFromModule('python-shell')

let count = 0

class PythonShellMocker {
  constructor () {
    this.count = 0
  }

  __setCount (val) {
    this.count = val
  }
  
  __getCount () {
    return this.count
  }
}

class PythonShell {
  constructor () {
    this.count = 0
    this.state = 'OK'
  }

  static __setCount (val) {
    this.count = val
  }

  static __changeState () {
    this.state = 'fail'
  }
  
  static __getCount () {
    return this.count
  }
  
  static run (path, option, callback) {
    if (global.__pyshell__) {
      return callback()
    } else {
      return callback('error occured')
    }
  }
  
}


// PythonShell.run = run
// PythonShell.__setCount = __setCount
exports.PythonShellMocker = PythonShellMocker
exports.PythonShell = PythonShell