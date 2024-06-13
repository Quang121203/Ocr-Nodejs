const express = require('express')
const app = express()
const router = require('./router')
const cors = require('cors')
const bodyParser = require('body-parser')

//get number cpus==============================================
// const os = require('os');
// const numCPUs = os.cpus().length;
// console.log(`Number of CPU cores: ${numCPUs}`);


//config enviroment variables =================================
require('dotenv').config()
const port = process.env.PORT

//config cors ==================================================
app.use(cors())

//config req.body =================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//config router =================================================
app.use('/', router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})