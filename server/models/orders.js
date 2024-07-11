const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Stocks = require("./stocks");
const Product = require("./products");

const Order = db.define("Order", {
  orderID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
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
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  productQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  barcode: {
    type: DataTypes.TEXT,
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
  imageUrl: {
    type: DataTypes.TEXT,
  },
});

Order.belongsTo(Product, {
  foreignKey: "productID",
  targetKey: "productID",
});

Order.belongsTo(Stocks, {
  foreignKey: "stockID",
  targetKey: "stockID",
});

module.exports = Order;
