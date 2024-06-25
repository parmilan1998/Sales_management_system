const {DataTypes} = require("sequelize")
const db = require("../database/db")
const Stocks = require("./stocks")
const Sales = require("./sales")
const Product = require("./products")

salesDetail = db.define(
    "salesDetail",{
        salesDetailID:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            validate: {
              notEmpty: true,
            },
        },
        productID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references: {
              model: "products",
              key: "productID",
            },
            validate: {
              notEmpty: true,
            },

        },
        stockID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references: {
              model: "stocks",
              key: "stockID",
            },
            validate: {
              notEmpty: true,
            },

        },
        salesID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references: {
              model: Sales,
              key: "salesID",
            },
            validate: {
              notEmpty: true,
            },

        },
        productName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        salesQuantity:{
            type:DataTypes.INTEGER,
            allowNull:false,
            validate:{
                notEmpty:true,
                min: 1,
            }
        },
        revenue:{
            type:DataTypes.FLOAT,
            allowNull:false,
            validate:{
                notEmpty:true
            },
        },
        unitPrice:{
            type:DataTypes.FLOAT,
            allowNull:false,
            validate:{
                notEmpty:true,
                min: 0,
            }
        },
    },{
      timestamp:true,
      tableName:"salesDetail"

    }
)
salesDetail.belongsTo(Product,{
    foreignKey:"productID",
    targetKey:"productID"
})

salesDetail.belongsTo(Stocks,{
    foreignKey:"stockID",
    targetKey:"stockID"
})

salesDetail.belongsTo(Sales,{
    foreignKey:"salesID",
    targetKey:"salesID"
})

module.exports=salesDetail
