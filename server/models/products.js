const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Category = require("./category");
const io = require("../index");

const Product = db.define(
  "Product",
  {
    productID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
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
    categoryID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "categories",
        key: "categoryID",
      },
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
    productDescription: {
      type: DataTypes.STRING,
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
    imageUrl: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    tableName: "products",
  }
);

Product.belongsTo(Category, {
  foreignKey: "categoryID",
  targetKey: "categoryID",
});

module.exports = Product;
