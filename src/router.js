const express = require('express')
const router = express.Router()
const upload = require("./config/multerConfig");

const { ocrController, ocrController2, ocrController3 } = require('./controllers/ocrController');
const userController = require('./controllers/userController');
const pdfController = require('./controllers/pdfController');

const { checkUser, checkPremistion } = require('./middleware/jwtActions');

//admin ==========================================================================
router.post("/ocr", upload.single("file"), checkUser, checkPremistion, ocrController);
router.post("/ocr2", upload.single("file"), checkUser, checkPremistion, ocrController2);
router.post("/ocr3", upload.single("file"), checkUser, checkPremistion, ocrController3);

//auth =================================================================================
router.post("/login", userController.login);
router.get("/logout", userController.logout);
router.post("/register", userController.register);

//pdf =================================================================================
router.post("/findpdf", checkUser, pdfController.findPDF);
router.get("/viewpdf/:fileName", checkUser, pdfController.viewPDF);
router.get("/pdf", checkUser, pdfController.getAllPDF);
router.get("/pdf/:id", checkUser, pdfController.getPDFById);
router.delete("/pdf/:fileName", checkUser, checkPremistion, pdfController.deletePDF);
router.put("/pdf/", checkUser, checkPremistion, pdfController.updatePDF);

//user =================================================================================
router.get("/info", checkUser, userController.getInformations);
router.delete("/users/:id", checkUser, checkPremistion, userController.deleteUser);
router.get("/users", checkUser, checkPremistion, userController.getAllUsers);
router.put("/users", checkUser, checkPremistion, userController.updateUser);
router.get("/users/:id", checkUser, userController.getUserById);

module.exports = router