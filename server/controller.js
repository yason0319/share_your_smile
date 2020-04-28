const 
crypto = require('crypto'),
NodeCache = require( "node-cache" ),
/* componentization of dropbox object [s] */
// Dropbox = require('dropbox').Dropbox,
// fetch = require('isomorphic-fetch');
dbx = require('./components/dropbox').dbx,
tokenclass = require('./components/token').token,
cron = require('node-cron'),
imgs = require('./routes/images').imgs,
exec = require('child_process').exec;
/* componentization of dropbox object [e] */
 
//Redirect URL to pass to Dropbox. Has to be whitelisted in Dropbox settings
const OAUTH_REDIRECT_URL='http://localhost:3000/auth';
// const OAUTH_REDIRECT_URL=process.env.BASE_URL + 'auth';

// const OAUTH_REDIRECT_URL='https://izurudropbox.herokuapp.com/auth';
 
/* componentization of dropbox object [s] */
//Dropbox configuration
// const config = {
//   fetch: fetch,
//   clientId: process.env.DBX_APP_KEY,
//   clientSecret: process.env.DBX_APP_SECRET
// };
 
// var dbx = new Dropbox(config);
/* componentization of dropbox object [e] */

var mycache = new NodeCache();



// homeディレクトリ遷移時の処理
async function home(req, res, next) {
 
  if(!req.session.token){
 
    //create a random state value
    let state = crypto.randomBytes(16).toString('hex');
 
    //Save state and the session id for 10 mins
    mycache.set(state, req.session.id, 6000);

    //get authentication URL and redirect
    authUrl = dbx.getAuthenticationUrl(OAUTH_REDIRECT_URL, state, 'code');
    res.redirect(authUrl);
   
  } else {
 
    //if a token exists, it can be used to access Dropbox resources
    dbx.setAccessToken(req.session.token);
 
    try{
      let account_details = await dbx.usersGetCurrentAccount();
      console.log(account_details)
      let display_name = account_details.name.display_name;
      dbx.setAccessToken(null); //clean up token
 
      res.render('index', { name: display_name});

      // start observer sequence
      imgs.mainLoop_start()
      // start python script
      // exec('python ./python/start.py', (err, stdout, stderr) => {
      //   if (err) { console.log(err); }
      // });

      res.redirect('/contents')
 
    }catch(error){
      dbx.setAccessToken(null);
      next(error);
    }
  }
}
 
//Redirect from Dropbox
async function auth(req, res, next) {
 
  //Dropbox can redirect with some errors
  if(req.query.error_description){
    return next( new Error(req.query.error_description));
  }
 
  //validate state ensuring there is a session id associated with it
  let state= req.query.state;
  if(!mycache.get(state)){
    return next(new Error("session expired or invalid state"));
  }
 
  //Exchange code for token
  if(req.query.code){

    try{
      let token = await dbx.getAccessTokenFromCode(OAUTH_REDIRECT_URL, req.query.code);
 
      //store token and invalidate state
      req.session.token = token;
      tokenclass.setAccessToken(token)
      mycache.del(state);
 
      res.redirect('/');
 
    }catch(error){
      return next(error);
    }
  }
}


module.exports = {
  home: home,
  auth: auth
}