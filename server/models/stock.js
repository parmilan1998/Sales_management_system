const {DataTypes} =require('sequelize')
const db = require('../database/db')
const Product = require('./products')


const Stock = db.define(
    "Stocks",
    {
        stockID:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            validate: {
              notEmpty: true,
            },
        },ProductID:{
            type:DataTypes.INTEGER,
            references:{
                model:"products",
                key:"ProductID"
            },
            validate: {
                notEmpty: true,
              }
        },stockLevel:{
            type:DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
              },
        }
    },{
        timestamps: true,
        tableName: "stocks"
    }
)

Stock.belongsTo(Product,{
    foreignKey:"ProductID",
    targetKey:"ProductID"

})

module.exports= Stock