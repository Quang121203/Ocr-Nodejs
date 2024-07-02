const PDFService = require('../services/pdfService');
// const { getAllPages } = require('../services/pageService');
// const { PDFDocument } = require('pdf-lib');
const { getFile, removeFile } = require('../config/minioConfig');

const findPDF = async (req, res) => {
    const result = await PDFService.findPDF(req.body.keyword);

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
    const buffer = await getFile(req.params.fileName);

    // const pages = await getAllPages(req.body.id);
    // pages.sort(function (a, b) {
    //     return a.name - b.name;
    // });

    // const mergedPdf = await PDFDocument.create();

    // for (const page of pages) {
    //     const pdfDoc = await PDFDocument.load(page.file);
    //     const [copiedPage] = await mergedPdf.copyPages(pdfDoc, [0]);
    //     mergedPdf.addPage(copiedPage);
    // }

    // const pdf = await mergedPdf.save();

    // const buffer = Buffer.from(pdf);

    res.setHeader('Content-Type', 'application/pdf');
    res.status(200).send(buffer);

}

const getAllPDF = async (req, res) => {
    const pdfs = await PDFService.getAllPDF();
    return res.status(200).json({
        EC: 0,
        EM: "",
        DT: pdfs
    })
}


const deletePDF = async (req, res) => {
    const fileName = req.params.fileName
    await PDFService.deletePDF(fileName);
    await removeFile(fileName);
    return res.status(200).json({
        EC: 0,
        EM: "Delete successfully",
        DT: ""
    })
}

const updatePDF = async (req, res) => {
    await PDFService.updatePDF(req.body);
    return res.status(200).json({
        EC: 0,
        EM: "Update successful",
        DT: ""
    });
}

const getPDFById = async (req, res) => {
    const pdf = await PDFService.getPDFById(req.params.id);
    return res.status(200).json({
        EC: 0,
        EM: "",
        DT: pdf
    });
}

module.exports = { findPDF, viewPDF, getAllPDF, deletePDF, updatePDF, getPDFById }