// __mocks__/fs.js
'use strict'

const path = require('path')
const fs = jest.genMockFromModule('fs')

// This is a custom function that our tests can use during setup to specify
// what the files on the "mock" filesystem should look like when any of the
// `fs` APIs are used.
let mockFiles = Object.create(null)
let mockContents = Object.create(null)
function __setMockFiles(newMockFiles) {
  mockFiles = Object.create(null)
  for (const file in newMockFiles) {
    var content = newMockFiles[file]
    const dir = path.dirname(file)
    if (!mockFiles[dir]) {
      mockFiles[dir] = []
    }
    mockFiles[dir].push(path.basename(file))
  }
  mockContents = newMockFiles
}

function __removeMockFiles() {
  mockFiles = Object.create(null)
  mockContents = Object.create(null)
}

// A custom version of `readdirSync` that reads from the special mocked out
// file list set via __setMockFiles
function readdirSync(directoryPath) {
  return mockFiles[directoryPath] || []
}

function readFileSync(directoryPath) {
  return mockContents[directoryPath] || []
}

function existsSync(directoryPath) {
  if (mockFiles[directoryPath]) {
    return true
  } else {
    return false
  }
}

function mkdirSync(directoryPath) {
  var file = { directoryPath: 'dummy' }
}

fs.__setMockFiles = __setMockFiles
fs.__removeMockFiles = __removeMockFiles
fs.readdirSync = readdirSync
fs.existsSync = existsSync
fs.mkdirSync = mkdirSync
fs.readFileSync = readFileSync

module.exports = fs;