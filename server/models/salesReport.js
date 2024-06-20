const {DataTypes} = require("sequelize")
const db = require("../database/db")
const Reports = require("./reports")
const Sales = require("./sales")

salesReport = db.define(
    "salesReport",{
        salesReportID:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            unique: true,
            validate: {
              notEmpty: true,
            },
        },
        reportID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references: {
              model: "reports",
              key: "reportID",
            },
            validate: {
              notEmpty: true,
            },

        },
        salesID:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references: {
              model: "sales",
              key: "salesID",
            },
            validate: {
              notEmpty: true,
            },

        }
    },{
      timestamp:true,
      tableName:"salesReport"

    }
)
salesReport.belongsTo(Reports,{
    foreignKey:"reportID",
    targetKey:"reportID"
})

salesReport.belongsTo(Sales,{
    foreignKey:"salesID",
    targetKey:"salesID"
})

module.exports=salesReport