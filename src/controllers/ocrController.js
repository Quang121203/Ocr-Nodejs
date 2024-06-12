const { removeFile, convertPDFtoImage, createPDF, savePDF,readPDF } = require('../services/fileService');
const { getInfomation, convertPDFtoText } = require('../services/ocrService')
const { insertPDF} = require('../services/pdfService');


const ocrController = async (req, res) => {
    try {
        req.file = req.body.name;
        const count = await convertPDFtoImage(req.file);

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
    }
}



module.exports = ocrController