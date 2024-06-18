const express = require('express')
const router = express.Router()
const upload = require("./config/multerConfig");

const {ocrController,ocrController2,ocrController3}= require('./controllers/ocrController');
const userController = require('./controllers/userController');
const pdfController = require('./controllers/pdfController');

router.post("/upload", upload.single("file"), ocrController);
router.post("/ocr", upload.single("file"), ocrController2);
router.post("/ocr3", upload.single("file"), ocrController3);

router.post("/login",userController.login);

router.get("/pdf/:keyword", pdfController.findPDF);
router.post("/pdf", pdfController.viewPDF);


module.exports = router