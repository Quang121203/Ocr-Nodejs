import { createWorker } from 'tesseract.js';

const ocr = async (image) => {

    const worker = await createWorker('vie', 1);

    await worker.setParameters({
        preserve_interword_spaces: '1',
    });

    const ret = await worker.recognize(image);
    return ret.data.text;
};

export default ocr