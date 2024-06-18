const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Product = require("./products");

const Purchase = db.define(
  "Purchase",
  {
    purchaseID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    purchaseVendor: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    vendorContact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    purchaseQuantity: {
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
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Purchase.belongsTo(Product, { foreignKey: "ProductID", as: "product" });

module.exports = Purchase;
