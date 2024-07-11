const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Reports = require("./reports");
const Purchase = require("./purchase");

purchaseReport = db.define(
  "purchaseReport",
  {
    purchaseReportID: {
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
    purchaseID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "purchases",
        key: "purchaseID",
      },
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    timestamps: true,
    tableName: "purchaseReport",
  }
);
purchaseReport.belongsTo(Reports, {
  foreignKey: "reportID",
  targetKey: "reportID",
});

purchaseReport.belongsTo(Purchase, {
  foreignKey: "purchaseID",
  targetKey: "purchaseID",
});

module.exports = purchaseReport;
