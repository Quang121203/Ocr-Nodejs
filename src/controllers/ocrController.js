const { removeFile, convertPDFtoImage, createPDF } = require('../services/fileService');
const { Worker } = require('worker_threads');
const os = require('os');
const path = require('path');

const ocrController = async (req, res) => {
    try {
        req.file = req.body.name;
        const count = await convertPDFtoImage(req.file);

        const numThreads = Math.min(count, os.cpus().length);
        // const numThreads = 16;
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

        const pdf = await createPDF(texts, req.file);

        const arrayBuffer = await pdf.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        removeFile(req.file, "files");
        for (let i = 0; i < count; i++) {
            removeFile(`page${i}.png`, "images");
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.status(200).send(buffer);

    } catch (error) {
        console.error(error);
    }
}

module.exports = ocrController