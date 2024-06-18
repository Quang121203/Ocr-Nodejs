const { remove } = require('../services/fileService');
const { ocr } = require('../services/ocrService')
const { insertPDF } = require('../services/pdfService');
const { insertPagePDF } = require('../services/pageService');

const ocrController = async (req, res) => {
    try {
        req.file = req.body.name;
        const { buffer, text, count } = await ocr(req.file);

        const PDF = await insertPDF({ ...text });

        await insertPagePDF(count, PDF.id);
        remove(req.file, count);

        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(buffer);
    } catch (error) {
        console.error(error);

        return res.status(200).json({
            EC: 1,
            EM: "Something went wrong in this PDF",
            DT: ''
        })
    }
}

const ocrController2 = async (req, res) => {
    try {
        req.file = req.body.name;
        const { buffer, count } = await ocr(req.file);

        const PDF = await insertPDF({ ...req.body, name: req.body.pdfName });

        await insertPagePDF(count, PDF.id);

        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(buffer);

    } catch (error) {
        console.error(error);

        return res.status(200).json({
            EC: 1,
            EM: "Something went wrong in this PDF",
            DT: ''
        })
    }
}

const ocrController3 = async (req, res) => {
    try {
        req.file = req.body.name;
        const { buffer, text, count } = await ocr(req.file,req.body.string);

        const PDF = await insertPDF({ ...text, number: req.body.number, adress: req.body.adress, date: req.body.date });

        await insertPagePDF(count, PDF.id);
        remove(req.file, count);

        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(buffer);
    } catch (error) {
        console.error(error);

        return res.status(200).json({
            EC: 1,
            EM: "Something went wrong in this PDF",
            DT: ''
        })
    }
}
module.exports = { ocrController, ocrController2, ocrController3 }