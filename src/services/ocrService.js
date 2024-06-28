const { createWorker } = require('tesseract.js');
const path = require('path');
const { Worker } = require('worker_threads');
const os = require('os');
const { remove, convertPDFtoImage, createPDF, splitPDF } = require('../services/fileService');
const { promises: fs } = require("node:fs");

const handleText = (text) => {
    let name = "";
    if (text[0]) {
        let line1 = text[0].split("   ");
        name = (line1[0].replace(/[^A-Za-zÀ-ỹ\s]/g, '')).trim();
    }

    let number = "";
    let adress = "";
    let date = [];

    if (text[1]) {
        let line2 = text[1].split("   ");
        number = (line2[0].replace(/[^A-Za-zÀ-ỹ\s\d\/\-]/g, '')).trim();

        let adress_date = line2[line2.length - 1];
        let postionAdress = adress_date.search("ngày");
        adress = (adress_date.slice(0, postionAdress)).replace(/[^A-Za-zÀ-ỹ\s]/g, '').trim();
        date = adress_date.match(/\d+/g);
    }

    let type = "";
    if (text[2]) {
        type = (text[2].replace(/[^A-Za-zÀ-ỹ\s\d\/\-\:]/g, '')).trim();
    }

    let content = "";
    if (text[3]) {
        content = (text[3].replace(/[^A-Za-zÀ-ỹ\s\d\/\-\:]/g, '')).trim();
    }

    if (!date || date.length != 3) {
        date = "";
    }
    else {
        date = `${date[0]}/${date[1]}/${date[2]}`;
    }

    return {
        name,
        number,
        adress,
        date: date,
        type,
        content
    }
}

const createWorkerInstance = async (image) => {
    const worker = await createWorker('vie', 1);
    await worker.setParameters({
        preserve_interword_spaces: '1',
    });

    const ret = await worker.recognize(path.join(__dirname, `../../public/images/page${image}.png`));

    const blocks = ret.data.blocks.sort((a, b) => a.bbox.y - b.bbox.y);
    await worker.terminate();
    return blocks;
};

const getInfomation = async () => {
    const blocks = await createWorkerInstance(0);
    let text = [];
    let baseline = [];
    blocks.forEach(block => {
        const paragraph = block.paragraphs[0];
        const lines = paragraph.lines;
        let foundAgency = false;
        let foundDate = false;
        const keywords = ["CỘNG", "HÒA", "XÃ", "HỘI", "CHỦ", "NGHĨA", "VIỆT", "NAM"];

        for (let i = 0; i < lines.length; i++) {
            const lineText = lines[i].text;
            if (!foundAgency && keywords.some(keyword => lineText.includes(keyword))) {
                text.push(lineText);
                foundAgency = true;
            }
            else if (!foundDate && (lineText.toLowerCase().includes("ngày")
                || lineText.toLowerCase().includes("tháng")
                || lineText.toLowerCase().includes("năm"))) {
                text.push(lineText);
                baseline = lines[i].baseline;

                text.push(lines[i + 1].text);
                text.push(lines[i + 2].text);
                foundDate = true;
                return;
            }
        }
    });

    return ({ text: handleText(text), baseline });
}

const convertImagetoText = async (image) => {
    const blocks = await createWorkerInstance(image);
    let textObject = [];
    let texts = "";
    blocks.forEach(block => {
        texts += " " + block.page.text;
        const paragraphs = block.paragraphs;
        paragraphs.forEach(paragraph => {
            const lines = paragraph.lines;
            lines.forEach(line => {
                line.words.forEach(word => {
                    textObject.push({
                        text: word.text,
                        baseline: word.baseline,
                        fontSize: word.font_size
                    });
                });
            });
        });
    });

    return {textObject,texts};
}
//count is number page pdf
const convertPDFtoText = async (count) => {
    const numThreads = Math.min(count, os.cpus().length);
    const chunkSize = Math.ceil(count / numThreads);
    const ocrPromises = [];

    for (let i = 0; i < numThreads; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, count);

        if (start >= count) break;

        ocrPromises.push(new Promise((resolve, reject) => {
            const worker = new Worker(path.resolve(__dirname, '../worker/ocrWorker.js'), {
                workerData: { start, end }
            });

            worker.on('message', resolve);
            worker.on('error', reject);
            worker.on('exit', (code) => {
                if (code !== 0) {
                    reject(new Error(`Worker stopped with exit code ${code}`));
                }
            });
        }));
    }

    let texts = await Promise.all(ocrPromises);
    texts = texts.flat();
    return texts;
}

const ocr = async (file, string = null) => {
    let count = 0;
    try {

        count = await convertPDFtoImage(file);
        //ocr pdf=====================================================================
        const texts = await convertPDFtoText(count);
        //ocr info===================================================================
        const { text, baseline } = await getInfomation();

        let pdf;
        // create pdf=============================================================
        if (string) {
            string = { string, baseline };
            pdf = await createPDF(texts, file, string)
        }
        else {
            pdf = await createPDF(texts, file);
        }

        const arrayBuffer = await pdf.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await fs.writeFile(path.join(__dirname, `../../public/ocr_files/${file}`), buffer);
        //await splitPDF(file);
       
        let fullText = "";
        texts.forEach(text => {
            fullText += " " + text.texts;
        });

        return { buffer, text: text, count, texts: fullText };
    }
    catch (error) {
        console.error(error);
        remove(file, count);
    }
}

module.exports = { convertImagetoText, getInfomation, convertPDFtoText, ocr }