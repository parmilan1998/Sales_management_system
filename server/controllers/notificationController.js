const { Op, fn, col } = require("sequelize");
const Stocks = require("../models/stocks");
const Product = require("../models/products");

// GET -> localhost:5000/api/v1/notification/low-stock
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Stocks.findAll({
      attributes: [
        "productID",
        [fn("sum", col("productQuantity")), "totalQuantity"],
      ],
      group: ["productID"],
      having: {
        totalQuantity: {
          [Op.gt]: 0,
          [Op.lte]: 10,
        },
      },
      include: [
        {
          model: Product,
          attributes: ["productName"],
        },
      ],
    });

    res.status(200).json({
      count: lowStockProducts.count,
      data: lowStockProducts.map((stock) => ({
        productId: stock.productID,
        productName: stock.Product.productName,
        totalQuantity: stock.dataValues.totalQuantity,
        message: `The product ${stock.Product.productName} has low stock (only ${stock.dataValues.totalQuantity} left).`,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch low stock products.",
      error: error.message,
    });
  }
};

// GET -> localhost:5000/api/v1/notification/out-of-stock
exports.getOutOfStockProducts = async (req, res) => {
  try {
    const outOfStockProducts = await Stocks.findAll({
      attributes: [
        "productID",
        [fn("SUM", col("productQuantity")), "totalQuantity"],
      ],
      group: ["productID"],
      having: {
        totalQuantity: 0, 
      },
      include: [
        {
          model: Product,
          attributes: ["productName"],
        },
      ],
    });

    res.status(200).json({
      data: outOfStockProducts.map((stock) => ({
        productId: stock.productID,
        productName: stock.Product.productName,
        totalQuantity: stock.dataValues.totalQuantity,
        message: `The product ${stock.Product.productName} is out of stock.`,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch out of stock products.",
      error: error.message,
    });
  }
};
