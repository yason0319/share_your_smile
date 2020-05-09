var express = require('express');
var router = express.Router();
const imgs = require('../components/images/images');

router.post('/', imgs.post); //home route
router.post('/test', imgs.test)
router.post('/get_list', imgs.getJsonList)
router.post('/contest/get_list', imgs.getContestJsonList)
router.post('/get', imgs.showLists)
 
module.exports = router