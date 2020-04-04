# share_your_smile server side

## setup

1. get dropbox account & app

  app url : https://www.dropbox.com/developers/apps/create

  and save App Key and App Secret

2. make file request folder

  https://help.dropbox.com/ja-jp/files-folders/share/create-file-request

3. set command

```bash
# initialize node_module
npm init

# install libraries
npm run install
```

4. set .env file

  set below value

```
DBX_APP_KEY
DBX_APP_SECRET
SESSION_ID_SECRET
FILE_REQUEST_PATH
```

## start server

```bash
npm start
```