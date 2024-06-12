'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pdf extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pdf.init({
    name: DataTypes.STRING,
    number: DataTypes.STRING,
    adress: DataTypes.STRING,
    date:DataTypes.STRING,
    type:DataTypes.STRING,
    content: DataTypes.STRING,
    file: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Pdf',
  });
  return Pdf;
};