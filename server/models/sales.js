const {DataTypes} = require('sequelize');
const db = require('../database/db')
const Category = require ('./category')
const Product = require('./products') 

const sales = db.define(
    "sales",{
        salesID:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            validate:{
                notEmpty:true
            }
        },
       
        productID:{
            type: DataTypes.INTEGER,
            allowNull:false,
            references: {
              model: "products",
              key: "productID",
            },
            validate: {
              notEmpty: true,
            },
        },
       revenue:{
            type:DataTypes.FLOAT,
            allowNull:false,
            validate:{
                notEmpty:true
            },
        },

            custName:{
                type:DataTypes.STRING,
                allowNull:false,
                validate:{
                    notEmpty:true
                }
            },
            customerContact:{
                type:DataTypes.STRING,
                allowNull:false,
                validate:{
                    notEmpty:true
                }
            },
            soldDate:{
              type: DataTypes.DATEONLY,
              allowNull: false,
              validate: {
                notEmpty: true,
              },
          }
        },
        {
        timestamps:true,
        tableName:"sales"
    }
)

sales.belongsTo(Category,{
    foreignKey:"categoryID",
    targetKey:"categoryID"
})

sales.belongsTo(Product,{
    foreignKey:"productID",
    targetKey:"productID"
})

module.exports = sales;