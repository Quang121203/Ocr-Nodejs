const PDFService = require('../services/pdfService');
// const { getAllPages } = require('../services/pageService');
// const { PDFDocument } = require('pdf-lib');
const { getFile } = require('../config/minioConfig');

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
    const buffer = await getFile(req.body.fileName);

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


module.exports = { findPDF, viewPDF }