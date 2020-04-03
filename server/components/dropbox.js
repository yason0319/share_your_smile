const
Dropbox = require('dropbox').Dropbox,
fetch = require('isomorphic-fetch');

//Dropbox configuration
const config = {
  fetch: fetch,
  clientId: process.env.DBX_APP_KEY,
  clientSecret: process.env.DBX_APP_SECRET
};
 
var dbx = new Dropbox(config);

module.exports = {
  dbx: dbx
}