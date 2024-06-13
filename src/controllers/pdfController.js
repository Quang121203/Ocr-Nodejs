const PDFService = require('../services/pdfService');
const { readPDF } = require('../services/fileService');
const path = require('path');

const findPDF = async (req, res) => {
    const result = await PDFService.findPDF(req.params.keyword);

    if (result.length == 0) {
        return res.status(200).json({
            EC: 1,
            EM: "Don't exist PDF with keyword",
            DT: []
        })
    }

    return res.status(200).json({
        EC: 0,
        EM: "",
        DT: result
    })
}

const viewPDF = async (req, res) => {
    const result = await PDFService.getPDF(req.body.id);

    if (result === null) {
        return res.status(404).json({
            EC: 1,
            EM: "this pdf dont exist",
            DT: ""
        })
    }

    const buffer = await readPDF(result.file);
    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).send(buffer);
}


const insertPDF = async (req, res) => {
    try {

        const filePath = path.join(__dirname, `../../public/ocr_files/${req.body.file}`)
        await PDFService.insertPDF({...req.body,file:filePath});
        const buffer = await readPDF(filePath);
        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(buffer);


    } catch (err) {
        console.log(err);
        return res.status(404).json({
            EC: 1,
            EM: err,
            DT: ""
        })
    }
}

module.exports = { findPDF, viewPDF, insertPDF }