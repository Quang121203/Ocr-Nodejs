const db = require("../models/index.js");
const Sequelize = require('sequelize');

const insertPDF = async (pdf) => {
  return await db.Pdf.create(pdf);
}

const getPDF = async (fileName) => {
  return await db.Pdf.findOne({ where: { fileName } });
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
        { content: { [Sequelize.Op.like]: `%${keyword}%` } },
        Sequelize.literal(`MATCH (text) AGAINST ('${keyword}')`)
      ]
    }
  });

  return Pdfs;
}

module.exports = { insertPDF, getPDF, findPDF }