'use strict'

const {PythonShell} = jest.genMockFromModule('python-shell')

function run (path, option, callback) {
  console.log('python shell run')
  setTimeout(() => {
    if (!option) {
      return
    }
    callback()
  }, 1000)
}

PythonShell.run = run

exports.PythonShell = PythonShell