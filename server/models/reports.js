const {DataTypes} = require('sequelize')
const db = require('../database/db')


const Reports = db.define(
    "Reports",{
        reportID:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            validate: {
              notEmpty: true,
            },
        }, periodStart:{
            type:DataTypes.DATE,
            allowNull:false,
            validate: {
                notEmpty: true,
              },
        }, periodEnd:{
            type:DataTypes.DATE,
            allowNull:false,
            validate: {
                notEmpty: true,
              },
        }, totalRevenue:{
            type:DataTypes.FLOAT,
            allowNull:false,
            validate: {
                notEmpty: true,
              },
        }, totalCOGS:{
            type:DataTypes.FLOAT,
            allowNull:false,
            validate: {
                notEmpty: true,
              },
        },grossProfit:{
            type:DataTypes.FLOAT,
            allowNull:false,
            validate: {
                notEmpty: true,
              },
        }, 
    },{
        timestamp:true,
        tableName:"reports"
    }
)

module.exports = Reports