const { unlink } = require('node:fs');
const path = require('path');
const { promises: fs } = require("node:fs");
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

const removeFile = (name, type) => {
  unlink(path.join(__dirname, `../../public/${type}/${name}`), (err) => {
    if (err) throw err;
  });
}

const convertPDFtoImage = async (file) => {
  const { pdf } = await import("pdf-to-img");
  let counter = 0;
  const document = await pdf(path.join(__dirname, `../../public/files/${file}`), { scale: 1 });
  const output = path.join(__dirname, `../../public/images/`);
  for await (const image of document) {
    await fs.writeFile(`${output}page${counter}.png`, image);
    counter++;
  }
  return counter;
}

const createPDF = async (texts, file) => {
  const originalPdfBytes = await fs.readFile(path.join(__dirname, `../../public/files/${file}`));

  const pdfDoc = await PDFDocument.load(originalPdfBytes);

  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await fs.readFile(path.join(__dirname, `../../public/Roboto-Regular.ttf`));
  const customFont = await pdfDoc.embedFont(fontBytes);

  texts.forEach((text) => {
    const page = pdfDoc.getPages()[text.page];
    const { height } = page.getSize();

    text.text.forEach(t => {

      page.drawText(t.text, {
        x: t.baseline.x0,
        y: height - t.baseline.y0,
        size: 13,
        font: customFont,
        color: rgb(0, 0, 0),
        opacity: 0,
      });
    })

  });

  const searchablePdfBytes = await pdfDoc.save();

  return new Blob([searchablePdfBytes], { type: 'application/pdf' });
}

const savePDF = async (buffer, file) => {
  const filePath = path.join(__dirname, `../../public/ocr_files/${file}`)
  await fs.writeFile(filePath, buffer)
  return filePath;
};

const readPDF = async (filePath) => {
  return await fs.readFile(filePath);
}

module.exports = { removeFile, convertPDFtoImage, createPDF, savePDF,readPDF }