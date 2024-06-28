const { parentPort, workerData } = require('worker_threads');
const { convertImagetoText } = require('../services/ocrService');

const { start, end } = workerData;

const promises = [];
for (let i = start; i < end; i++) {
    promises.push(convertImagetoText(i).then(({ textObject, texts }) => ({ page: i, text: textObject, texts })));
}

Promise.all(promises)
    .then(data => parentPort.postMessage(data))
    .catch(err => parentPort.postMessage({ error: err.message }));