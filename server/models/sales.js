const { DataTypes } = require('sequelize');
const db = require('../database/db');
const Category = require('./category');
const Product = require('./products');

const Sales = db.define('sales', {
  salesID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    validate: {
      notEmpty: true
    }
  },
  custName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  customerContact: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: true,
  tableName: 'sales'
});

const SalesDetail = db.define('salesDetail', {
  salesDetailID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    validate: {
      notEmpty: true
    }
  },
  salesID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'sales',
      key: 'salesID'
    },
    validate: {
      notEmpty: true
    }
  },
  categoryID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'categoryID'
    },
    validate: {
      notEmpty: true
    }
  },
  productID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'productID'
    },
    validate: {
      notEmpty: true
    }
  },
 
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  salesQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  unitPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  revenue: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
}, {
  timestamps: false,
  tableName: 'sales_detail'
});

Sales.hasMany(SalesDetail, {
  foreignKey: 'salesID',
  sourceKey: 'salesID'
});

SalesDetail.belongsTo(Sales, {
  foreignKey: 'salesID',
  targetKey: 'salesID'
});

SalesDetail.belongsTo(Product, {
  foreignKey: 'productID',
  targetKey: 'productID'
});

module.exports = { Sales, SalesDetail };
