module.exports = {
  verbose: true,
  transform: {
    '^.+\\.js$'  : '<rootDir>/node_modules/babel-jest'
  },
  modulePaths: [
    "<rootDir>"
  ],
  moduleFileExtensions: [
    'js',
    'json'
  ], // テスト対象の拡張子を列挙する
  setupFiles: [
    './setupJest.js',
    'dotenv/config'
  ],
  coveragePathIgnorePatterns: [
    'app.js'
  ],
  globals: {
    '__pyshell__': true,
    '__dbx__' : {
      'user' : true,
      'token' : true,
      'fileList' : true,
      'download' : true
    }
  }
};