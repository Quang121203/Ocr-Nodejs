const express = require('express')
const router = express.Router()
const upload = require("./config/multerConfig");

const ocrController= require('./controllers/ocrController');

router.post("/upload", upload.single("file"), ocrController);

module.exports = router