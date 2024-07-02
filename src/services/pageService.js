const db = require("../models/index.js");
const fs = require('fs');
const path = require('path');


const insertPage = async (page) => {
    return await db.Page.create(page);
}

const insertPagePDF = async (count, pdf) => {
    for (let i = 0; i < count; i++) {
        const pathToPage = path.join(__dirname, `../../public/pages/page${i}.pdf`);
        const file = await fs.promises.readFile(pathToPage);
        const name = `page${i}`;
        const body = {
            name,
            file,
            pdf
        };
        await insertPage(body);
    }
};

const getAllPages = async (pdf) => {
    return await db.Page.findAll({
        where: {
            pdf: pdf
        }
    });
}

export { insertPage, insertPagePDF, getAllPages }