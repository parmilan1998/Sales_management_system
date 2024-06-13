'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      ProductID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ProductName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      categoryID: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Categories',
          key: 'categoryID'
        },
        onDelete: 'CASCADE'
      },
      PDescription: {
        allowNull: false,
        type: Sequelize.STRING
      },
      UnitPrice: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      M_Date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      E_Date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};
