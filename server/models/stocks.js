const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Purchase = require("./purchase");
const Product = require("./products");
const Unit = require("./unit");

const Stocks = db.define(
  "stocks",
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
    unitID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "unit",
        key: "unitID",
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
    },
    relatedPurchaseIDs: {
      type: DataTypes.TEXT,
    },
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

Stocks.belongsTo(Unit, {
  foreignKey: "unitID",
  targetKey: "unitID",
});

module.exports = Stocks;
