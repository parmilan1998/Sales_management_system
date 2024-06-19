const { DataTypes } = require("sequelize");
const db = require("../database/db");
const User = require("./user");
const Product = require("./products");

const Notification = db.define(
  "Notification",
  {
    notificationID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    notificationType: {
      type: DataTypes.ENUM("lowStock", "outOfStock", "expiredStock"),
      defaultValue: "lowStock",
    },
    notificationMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productID: {
      type: DataTypes.INTEGER,
      references: {
        model: Product,
        key: "productID",
      },
      allowNull: false,
    },
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "userID",
      },
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Notification.belongsTo(User, { foreignKey: "userID" });
Notification.belongsTo(Product, { foreignKey: "productID" });

module.exports = Notification;
