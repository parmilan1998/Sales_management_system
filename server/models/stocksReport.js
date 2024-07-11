const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Reports = require("./reports");
const Stocks = require("./stocks");

stocksReport = db.define(
  "stocksReport",
  {
    stocksReportID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    reportID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "reports",
        key: "reportID",
      },
      validate: {
        notEmpty: true,
      },
    },
    stockID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "stocks",
        key: "stockID",
      },
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    timestamps: true,
    tableName: "stocksReport",
  }
);
stocksReport.belongsTo(Reports, {
  foreignKey: "reportID",
  targetKey: "reportID",
});

stocksReport.belongsTo(Stocks, {
  foreignKey: "stockID",
  targetKey: "stockID",
});

module.exports = stocksReport;
