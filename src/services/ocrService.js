const { createWorker } = require('tesseract.js');
const path = require('path');

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

module.exports = {convertImagetoText}