const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Product = require("./products");

const Unit = db.define(
  "unit",
  {
    unitID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    unitType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    timestamps: true,
    tableName: "unit",
  }
);

module.exports = Unit;
