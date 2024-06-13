const { removeFile, convertPDFtoImage, createPDF, savePDF } = require('../services/fileService');
const { getInfomation, convertPDFtoText } = require('../services/ocrService')
const { insertPDF } = require('../services/pdfService');


// const ocr = async(file) => {
//     let count = 0;

//     count = await convertPDFtoImage(file);

//     //ocr pdf=====================================================================
//     const texts = await convertPDFtoText(count);

//     // create pdf=============================================================
//     const pdf = await createPDF(texts, req.file);

//     const arrayBuffer = await pdf.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     const filePath=await savePDF(buffer, req.file);
//     return filePath;
// }

const ocrController = async (req, res) => {
    let count = 0;
    try {
        req.file = req.body.name;
        count = await convertPDFtoImage(req.file);

        //ocr info===================================================================
        const textInfo = await getInfomation();

        //ocr pdf=====================================================================
        const texts = await convertPDFtoText(count);

        // create pdf=============================================================
        const pdf = await createPDF(texts, req.file);

        const arrayBuffer = await pdf.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const filePath = await savePDF(buffer, req.file);

        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(buffer);

        //remove file===============================================================
        removeFile(req.file, "files");
        for (let i = 0; i < count; i++) {
            removeFile(`page${i}.png`, "images");
        }

        await insertPDF({ ...textInfo, file: filePath });

    } catch (error) {
        console.error(error);
        removeFile(req.file, "files");
        for (let i = 0; i < count; i++) {
            removeFile(`page${i}.png`, "images");
        }
        return res.status(200).json({
            EC: 1,
            EM: "Something went wrong in this PDF",
            DT: ''
        })
    }
}


const ocrController2 = async (req, res) => {
    let count = 0;
    try {
        req.file = req.body.name;
        count = await convertPDFtoImage(req.file);

        //ocr pdf=====================================================================
        const texts = await convertPDFtoText(count);

        // create pdf=============================================================
        const pdf = await createPDF(texts, req.file);

        const arrayBuffer = await pdf.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await savePDF(buffer, req.file);

        res.status(200).json({
            EC: 0,
            EM: "",
            DT: ''
        })

        removeFile(req.file, "files");
        for (let i = 0; i < count; i++) {
            removeFile(`page${i}.png`, "images");
        }

    } catch (error) {
        console.error(error);
        removeFile(req.file, "files");
        for (let i = 0; i < count; i++) {
            removeFile(`page${i}.png`, "images");
        }
        return res.status(200).json({
            EC: 1,
            EM: "Something went wrong in this PDF",
            DT: ''
        })
    }
}


module.exports = { ocrController, ocrController2 }