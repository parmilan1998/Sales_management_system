const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Category = require("./category");

const Product = db.define(
  "Product",
  {
    ProductID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    ProductName: {
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
    PDescription: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    UnitPrice: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    M_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    E_Date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    timestamps: true,
    tableName: "Products",
  }
);

Product.belongsTo(Category, {
  foreignKey: "categoryID",
  targetKey: "categoryID",
});

module.exports = Product;
