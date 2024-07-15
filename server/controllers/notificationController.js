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
          [Op.lt]: 10,
        },
      },
      include: [
        {
          model: Product,
          attributes: ["productName"],
        },
      ],
    });

    const notifications = lowStockProducts
      .map((stock) => {
        const productName = stock.Product.productName;
        const totalQuantity = stock.dataValues.totalQuantity;

        if (totalQuantity == 0) {
          return {
            productId: stock.productID,
            productName,
            totalQuantity,
            message: `The product ${productName} is out of stock.`,
          };
        } else if (totalQuantity < 10) {
          return {
            productId: stock.productID,
            productName,
            totalQuantity,
            message: `The product ${productName} has low stock (only ${totalQuantity} left).`,
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
