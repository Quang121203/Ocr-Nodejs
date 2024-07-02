const { remove } = require('../services/fileService');
const { ocr } = require('../services/ocrService')
const { insertPDF } = require('../services/pdfService');
// const { insertPagePDF } = require('../services/pageService');
const { uploadFile } = require('../config/minioConfig');

const handleError = (res, error) => {
    console.error(error);
    return res.status(200).json({
        EC: 1,
        EM: "Something went wrong in this PDF",
        DT: ''
    })
};

const handleSuccess = async (req,res, count,buffer) => {
    await uploadFile(req.file)
    remove(req.file, count);

    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).send(buffer);
};

const ocrController = async (req, res) => {
    try {
        req.file = req.body.name;
        // text: infomation
        // texts: fullText
        const { buffer, text, count, texts } = await ocr(req.file);

        await insertPDF({ ...text, text: texts, fileName: req.file });

        // await insertPagePDF(count, PDF.id);
        await handleSuccess(req,res,count,buffer);
    } catch (error) {
        return handleError(res, error);
    }
}

const ocrController2 = async (req, res) => {
    try {
        req.file = req.body.name;
        const { buffer, count, texts } = await ocr(req.file);

        await insertPDF({ ...req.body, name: req.body.pdfName, text: texts, fileName: req.file });

        // await insertPagePDF(count, PDF.id);
        await handleSuccess(req,res,count,buffer);
    } catch (error) {
        return handleError(res, error);
    }
}

const ocrController3 = async (req, res) => {
    try {
        req.file = req.body.name;
        const { buffer, text, count, texts } = await ocr(req.file, req.body.string);

        await insertPDF({ ...text, ...req.body, text: texts, name: text.name, fileName: req.file });

        // await insertPagePDF(count, PDF.id);
        await handleSuccess(req,res,count,buffer);
    } catch (error) {
        return handleError(res, error);
    }
}

module.exports = { ocrController, ocrController2, ocrController3 }