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
        [Op.or]: [
          { totalQuantity: { [Op.lte]: 5 } },
          {
            [Op.and]: [
              { totalQuantity: { [Op.gt]: 5 } },
              { totalQuantity: { [Op.lte]: col("Product.reOrderLevel") } },
            ],
          },
        ],
      },
      include: [
        {
          model: Product,
          attributes: ["productName", "reOrderLevel"],
        },
      ],
    });

    const notifications = lowStockProducts
      .map((stock) => {
        const productName = stock.Product.productName;
        const totalQuantity = stock.dataValues.totalQuantity;
        const reOrderLevel = stock.Product.reOrderLevel;

        if (totalQuantity == 0) {
          return {
            productId: stock.productID,
            productName,
            totalQuantity,
            reOrderLevel,
            message: `The  ${productName} is out of stock.`,
          };
        } else if (totalQuantity <= 10) {
          return {
            productId: stock.productID,
            productName,
            totalQuantity,
            reOrderLevel,
            message: `The  ${productName} has low stock (only ${totalQuantity} left).`,
          };
        } else if (totalQuantity > 10 && totalQuantity <= reOrderLevel) {
          return {
            productId: stock.productID,
            productName,
            totalQuantity,
            reOrderLevel,
            message: `The ${stock.Product.productName} needs to be reordered (current stock is ${stock.dataValues.totalQuantity}, reorder level is ${stock.Product.reOrderLevel}).`,
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
