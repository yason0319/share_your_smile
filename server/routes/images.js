var express = require('express');
var router = express.Router();
var dbx = require('../components/dropbox').dbx;
const controller = require('../controller');
const tokenclass = require('../components/token').token;
const fs = require('fs');
const execSync = require('child_process').execSync;

var {PythonShell} = require('python-shell')
// import {PythonShell} from 'python-shell'


require('dotenv').config({silent: true});

var counter = 0
 
class Lists {
  constructor () {
    this.imgLists = []
  }

  addList (content) {
    // console.log(content)
    this.imgLists.push(content)
  }

  initializeList () {
    this.imgLists = []
  }
}

class Images {
  constructor () {
  }

  post (req, res) {
    var token = tokenclass.getAccessToken()
    console.log('token : ' + token)
    res.send({
      token: token,
      reply: 'hello'
    })
  }

  test (req, res) {
    res.send({
      reply: 'this only test'
    })
  }

  async getJsonList (req, res) {
    try {
      const jsonObject = JSON.parse(fs.readFileSync('./assets/json/images.json', 'utf8'));
      res.send(jsonObject)
    } catch {
      res.send({
        error: 'something happened'
      })
    }
  }

  async getContestJsonList (req, res) {
    try {
      const jsonObject = JSON.parse(fs.readFileSync('./assets/json/contest.json', 'utf8'));
      res.send(jsonObject)
    } catch {
      res.send({
        error: 'something happened'
      })
    }
  }

  async getList_api (req, res) {
    console.log('start')
    try {
      await imgs.getList()
      res.send({
        ok: true
      })
    } catch {
      res.send({
        error: 'something happened'
      })
    }
  }


  // get list of images in file_request folder
  async getList () {
    var token = tokenclass.getAccessToken()
    dbx.setAccessToken(token);

    await dbx.filesListFolder({path: process.env.FILE_REQUEST_PATH})
    .then(function(response) {
      response.entries.forEach(entry => {
        lists.addList(entry.name)
      })
      dbx.setAccessToken(null);
    })
    .catch(function(error) {
      dbx.setAccessToken(null);
      console.log(error)
    });
  }

  // save image file from list
  async download (index) {
    var download_from = process.env.FILE_REQUEST_PATH + '/' + lists.imgLists[index]
    var download_to = './assets/tmp_image/' + lists.imgLists[index]
    // 既にファイルがあれば、APIコールしない
    if (fs.existsSync(download_to) === false) {
      var token = tokenclass.getAccessToken()
      await dbx.setAccessToken(token);
      await dbx.filesDownload({path: download_from})
      .then(function(response) {
        fs.writeFileSync(download_to, new Buffer.from(response.fileBinary), 'binary');
        console.log('download done')
        dbx.setAccessToken(null);
      })
      .catch(function(error) {
        dbx.setAccessToken(null);
        console.log(error)
      })
    } else {
      // console.log('api not called')
    }
  }

  async mainLoop_api (req, res) {
    console.log('start')
    try {
      await imgs.mainLoop()
      res.send({
        ok: true
      })
    } catch {
      res.send({
        error: 'something happened'
      })
    }

  }

  async mainLoop_start () {
    // ディレクトリを作成する
    let paths = [
      './assets',
      './assets/tmp_image',
      './assets/json',
      './public/images',
      './public/contest'
    ]
    paths.forEach(path => {
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
    })
    imgs.mainLoop()
  }

  // get file list
  // download image file
  async mainLoop () {
    // reset List
    lists.initializeList()
    await imgs.getList()
    // console.log(lists.imgLists.length)
    const results = []
    for (var num = 0;num < lists.imgLists.length; num++) {
      results.push(imgs.download(num))
    }
    await Promise.all(results)

    // console.log('exec python')
    await imgs.makeJsonSlideImage()

    setTimeout(() => {
      counter++
      // console.log('Loop :' + counter)
      imgs.mainLoop()
    }, 3000)
    
  }

  showLists (req, res) {
    var show_lists = []
    lists.imgLists.forEach(list => {
      var tmp = { LIST: list }
      show_lists.push(tmp)
    })
    res.send(show_lists)
  }

  // execcute python
  async makeJsonSlideImage () {
    // execute by shellcommand

    // execute by python-shell < better method
    await PythonShell.run('./python/start.py', null, function (err) {
      if (err) throw err;
    });
  }
  
}

const imgs = new Images();
const lists = new Lists();

router.post('/', imgs.post); //home route
router.post('/test', imgs.test)
router.post('/get_list', imgs.getJsonList)
router.post('/contest/get_list', imgs.getContestJsonList)
// router.post('/image/*', imgs.getImage)
router.post('/get', imgs.showLists)
router.post('/loop', imgs.mainLoop_api)
 
module.exports =　{
  router: router,
  imgs: imgs
}