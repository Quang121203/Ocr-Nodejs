const { unlink } = require('node:fs');
const path = require('path');
const { promises: fs } = require("node:fs");
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');


const removeFile = (name, type) => {
  unlink(path.join(__dirname, `../../public/${type}/${name}`), (err) => {
    if (err) throw err;
  });
}

const remove = (file, count) => {
  removeFile(file, "files");
  removeFile(file, "ocr_files");
  for (let i = 0; i < count; i++) {
    removeFile(`page${i}.png`, "images");
    // removeFile(`page${i}.pdf`, "pages");
  }
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

const createPDF = async (texts, file, string = null) => {
  const originalPdfBytes = await fs.readFile(path.join(__dirname, `../../public/files/${file}`));

  const pdfDoc = await PDFDocument.load(originalPdfBytes);

  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await fs.readFile(path.join(__dirname, `../../public/Roboto-Regular.ttf`));
  const customFont = await pdfDoc.embedFont(fontBytes);

  texts.forEach((text) => {
    const page = pdfDoc.getPages()[text.page];

    const { height } = page.getSize();

    text.text.forEach(t => {
      if (string && t.baseline.y0 == string.baseline.y0 && +text.page === 0) {
        page.drawText(string.string, {
          x: string.baseline.x0,
          y: height - string.baseline.y0,
          size: 13,
          font: customFont,
          color: rgb(0, 0, 0),
          opacity: 0,
        });
      }
      else {
        page.drawText(t.text, {
          x: t.baseline.x0,
          y: height - t.baseline.y0,
          size: 13,
          font: customFont,
          color: rgb(0, 0, 0),
          opacity: 0,
        });
      }
    })

  });

  const searchablePdfBytes = await pdfDoc.save();

  return new Blob([searchablePdfBytes], { type: 'application/pdf' });
}


const readPDF = async (filePath) => {
  return await fs.readFile(filePath);
}

const splitPDF = async (file) => {
  const pathToPdf = path.join(__dirname, `../../public/ocr_files/${file}`);

  const originalPdfBytes = await fs.readFile(pathToPdf);

  const pdfDoc = await PDFDocument.load(originalPdfBytes)

  const numberOfPages = pdfDoc.getPages().length;

  for (let i = 0; i < numberOfPages; i++) {
    const PDF = await PDFDocument.create();

    const [copiedPage] = await PDF.copyPages(pdfDoc, [i])
    PDF.addPage(copiedPage);
    const pdfBytes = await PDF.save()
    await fs.writeFile(path.join(__dirname, `../../public/pages/page${i}.pdf`), pdfBytes);
  }

}


module.exports = { removeFile, convertPDFtoImage, createPDF, readPDF, remove, splitPDF }