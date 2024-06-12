const { createWorker } = require('tesseract.js');
const path = require('path');
const { Worker } = require('worker_threads');
const os = require('os');

const handleText = (text) => {
    let line1 = text[0].split("   ");
    let name = (line1[0].replace(/[^A-Za-zÀ-ỹ\s]/g, '')).trim();

    let line2 = text[1].split("   ");
    let number = (line2[0].slice(2).replace(/[^A-Za-zÀ-ỹ\s\d\/\-]/g, '')).trim();

    let adress_date = line2[line2.length - 1];
    let postionAdress = adress_date.search("ngày");
    let adress = (adress_date.slice(0, postionAdress)).replace(/[^A-Za-zÀ-ỹ\s]/g, '').trim();
    let date = adress_date.match(/\d+/g);
    let type = (text[2].replace(/[^A-Za-zÀ-ỹ\s\d\/\-\:]/g, '')).trim();
    let content = (text[3].replace(/[^A-Za-zÀ-ỹ\s\d\/\-\:]/g, '')).trim();
    return {
        name,
        number,
        adress,
        date: `${date[0]}/${date[1]}/${date[2]}`,
        type,
        content
    }
}

const getInfomation = async () => {
    const worker = await createWorker('vie', 1);

    await worker.setParameters({
        preserve_interword_spaces: '1',
    });

    const ret = await worker.recognize(path.join(__dirname, `../../public/images/page0.png`));

    const blocks = ret.data.blocks.sort((a, b) => a.bbox.y - b.bbox.y);
    let text = [];

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
                text.push(lines[i + 1].text);
                text.push(lines[i + 2].text);
                foundDate = true;
                return;
            }
        }
    });


    // blocks.forEach(block => {
    //     const paragraph = block.paragraphs[0];
    //     const lines = paragraph.lines;
    //     let check = false;
    //     for (var i = 0; i < lines.length; i++) {

    //         if ((lines[i].text.includes("CỘNG")
    //             || lines[i].text.includes("HÒA")
    //             || lines[i].text.includes("XÃ")
    //             || lines[i].text.includes("HỘI")
    //             || lines[i].text.includes("CHỦ")
    //             || lines[i].text.includes("NGHĨA")
    //             || lines[i].text.includes("VIỆT")
    //             || lines[i].text.includes("NAM")) && !check
    //         ) {
    //             text.push(lines[i].text);
    //             check = true;
    //         }
    //         else if (lines[i].text.toLowerCase().includes("ngày")
    //             || lines[i].text.toLowerCase().includes("tháng")
    //             || lines[i].text.toLowerCase().includes("năm")
    //         ) {
    //             text.push(lines[i].text);
    //             text.push(lines[i + 1].text);
    //             text.push(lines[i + 2].text);
    //             return;
    //         }
    //     }

    // });

    await worker.terminate();
    return handleText(text);
}

const convertImagetoText = async (image) => {
    const worker = await createWorker('vie', 1);

    await worker.setParameters({
        preserve_interword_spaces: '1',
    });

    const ret = await worker.recognize(path.join(__dirname, `../../public/images/page${image}.png`));

    const blocks = ret.data.blocks.sort((a, b) => a.bbox.y - b.bbox.y);
    let textObject = [];

    blocks.forEach(block => {
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

    await worker.terminate();
    return textObject;
}
//count is number page pdf
const convertPDFtoText = async(count) => {
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

module.exports = { convertImagetoText, getInfomation, convertPDFtoText}