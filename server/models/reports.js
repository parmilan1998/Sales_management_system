const { DataTypes } = require("sequelize");
const db = require("../database/db");

const Reports = db.define(
  "Reports",
  {
    reportID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    reportName:{
      type:DataTypes.STRING
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    totalRevenue: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    totalCOGS: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    grossProfit: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    reportFile:{
      type:DataTypes.TEXT
    }
  },
  {
    timestamps: true,
    tableName: "reports",
  }
);

module.exports = Reports;
