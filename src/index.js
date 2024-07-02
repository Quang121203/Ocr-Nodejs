const express = require('express')
const app = express()
const router = require('./router')
const bodyParser = require('body-parser')
const { createBuket } = require('./config/minioConfig');
var cookieParser = require('cookie-parser')
const {connectRedis } = require('./config/redisConfig');

//get number cpus==============================================
// const os = require('os');
// const numCPUs = os.cpus().length;
// console.log(`Number of CPU cores: ${numCPUs}`);


//config enviroment variables =================================
require('dotenv').config()
const port = process.env.PORT

//config cors ==================================================
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});


//config cooki====================================================
app.use(cookieParser())

//config req.body =================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// connectRedis();

//config minio ====================================================
createBuket();

//config router =================================================
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})