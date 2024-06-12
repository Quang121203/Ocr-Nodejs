const db = require("../models/index.js");
const Sequelize = require('sequelize');

const insertPDF = async (pdf) => {
    return await db.Pdf.create(pdf);
}

const getPDF = async (id) => {
    return await db.Pdf.findByPk(id);
}

const findPDF = async (keyword) => {
    const Pdfs = await db.Pdf.findAll({
        where: {
          [Sequelize.Op.or]: [
            { name: { [Sequelize.Op.like]: `%${keyword}%` } },
            { number: { [Sequelize.Op.like]: `%${keyword}%` } },
            { adress: { [Sequelize.Op.like]: `%${keyword}%` } },
            { date: { [Sequelize.Op.like]: `%${keyword}%` } },
            { type: { [Sequelize.Op.like]: `%${keyword}%` } },
            { content: { [Sequelize.Op.like]: `%${keyword}%` } }
          ]
        }
      });
    return Pdfs;
}

module.exports = { insertPDF, getPDF,findPDF }