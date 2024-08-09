const { DataTypes } = require("sequelize");
const db = require("../database/db");

const Category = db.define(
  "categories",
  {
    categoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    categoryDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imageUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    // Other model options go here
  }
);

module.exports = Category;
