const { DataTypes } = require("sequelize");
const db = require("../database/db");
const Category = require("./category");
const io = require("../index");
const Unit = require("./unit");

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
    code: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    unitID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "unit",
        key: "unitID",
      },
      validate: {
        notEmpty: true,
      },
    },
    unitType: {
      type: DataTypes.STRING,
      allowNull: false,
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
    reOrderLevel: {
      type: DataTypes.INTEGER,
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

Product.belongsTo(Unit, {
  foreignKey: "unitID",
  targetKey: "unitID",
});

module.exports = Product;
