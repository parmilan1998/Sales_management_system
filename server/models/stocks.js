const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Purchase = require("./purchase");
const Product = require("./products");

const Stocks = db.define(
  "Stocks",
  {
    stockID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    purchaseID: {
      type: DataTypes.INTEGER,
      references: {
        model: "purchases",
        key: "purchaseID",
      },
      validate: {
        notEmpty: true,
      },
    },
    productID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "products",
        key: "productID",
      },
      validate: {
        notEmpty: true,
      },
    },
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    purchasePrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    manufacturedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    purchasedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    relatedPurchaseIDs:{
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true,
      },
    }
  },
  {
    timestamps: true,
    tableName: "stocks",
  }
);

Stocks.belongsTo(Product, {
  foreignKey: "productID",
  targetKey: "productID",
});
Stocks.belongsTo(Purchase, {
  foreignKey: "purchaseID",
  targetKey: "purchaseID",
});

module.exports = Stocks;
