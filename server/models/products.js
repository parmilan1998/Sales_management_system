const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Category = require("./category");

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
