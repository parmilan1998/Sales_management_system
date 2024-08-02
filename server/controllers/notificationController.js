const { Op, fn, col , literal } = require("sequelize");
const Stocks = require("../models/stocks");
const Product = require("../models/products");

// GET -> localhost:5000/api/v1/notification/low-stock
exports.getLowStockProducts = async (req, res) => {
  try {
    const lowStockProducts = await Product.findAll({
      attributes: [
        'productID',
        'productName',
        'reOrderLevel',
        [
          literal(`(
            SELECT COALESCE(SUM(s.productQuantity), 0)
            FROM Stocks s
            WHERE s.productID = Product.productID
          )`),
          'totalQuantity',
        ],
      ],
    });

    const notifications = lowStockProducts
      .map((product) => {
        const totalQuantity = product.dataValues.totalQuantity || 0;
        const { productID, productName, reOrderLevel } = product;
        if (totalQuantity == 0) {
          return {
            productId: productID,
            productName,
            totalQuantity,
            reOrderLevel,
            message: `The ${productName} is out of stock.`,
          };
        } else if (totalQuantity <= 10) {
          return {
            productId: productID,
            productName,
            totalQuantity,
            reOrderLevel,
            message: `The ${productName} has low stock (only ${totalQuantity} left).`,
          };
        } else if (totalQuantity > 10 && totalQuantity <= reOrderLevel) {
          return {
            productId: productID,
            productName,
            totalQuantity,
            reOrderLevel,
            message: `The ${productName} needs to be reordered (current stock is ${totalQuantity}, reorder level is ${reOrderLevel}).`,
          };
        }
      })
      .filter((notification) => notification !== undefined);

    res.status(200).json({
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch low stock products.",
      error: error.message,
    });
  }
};
