import { createWorker } from 'tesseract.js';
import axios from '../config/axios.js';

const createWorkerInstance = async () => {
    const worker = await createWorker('vie', 1);
    await worker.setParameters({
        preserve_interword_spaces: '1',
    });
    return worker;
};

const ocr = async (image) => {

    const worker = await createWorkerInstance();

    const ret = await worker.recognize(image);
    await worker.terminate();
    return ret.data.text;
};

const getInfomation = async (image) => {
    const worker = await createWorkerInstance();

    const ret = await worker.recognize(image);

    const blocks = ret.data.blocks.sort((a, b) => a.bbox.y - b.bbox.y);
    let text = null;

    blocks.forEach(block => {
        const paragraph = block.paragraphs[0];
        const lines = paragraph.lines;
        for (let i = 0; i < lines.length; i++) {
            const lineText = lines[i].text;
            if (lineText.toLowerCase().includes("ngày")
                || lineText.toLowerCase().includes("tháng")
                || lineText.toLowerCase().includes("năm")) {
                text = lines[i];
                return;
            }
        }
    });

    await worker.terminate();
    var space = ((text.text.split("  ")).length - 1)*2;
    return { ...text.bbox, space };
};

const handleUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post('http://localhost:5000/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.result;

    } catch (error) {
      console.error('Error uploading file:', error);
    }
};


export default ocr

export { getInfomation,handleUpload }