const { Op } = require("sequelize");
const Stocks = require("../models/stocks");
const Product = require("../models/products");
const Purchase = require("../models/purchase");

// POST -> localhost:5000/api/v1/stocks
exports.createStocks = async (req, res) => {
  try {
    let stocks = req.body;

    // Ensure stocks is an array
    if (!Array.isArray(stocks)) {
      stocks = [stocks];
    }

    const stocksItems = await Promise.all(
      stocks.map(async (stock) => {
        const {
          productName,
          productQuantity,
          purchasePrice,
          manufacturedDate,
          expiryDate,
          purchasedDate,
        } = stock;

        try {
          if (
            !productName ||
            !productQuantity ||
            !manufacturedDate ||
            !expiryDate
          ) {
            res.status(400).json({ message: "Fill all the required fields!" });
          }
          const product = await Product.findOne({
            where: { productName },
          });

          if (!product) {
            res.status(404).json({ message: "Product not found" });
          }

          const existingStock = await Stocks.findOne({
            where: {
              productID: product.productID,
              productName,
              purchasePrice,
              manufacturedDate,
              expiryDate,
            },
          });

          if (existingStock) {
            const updatedStock = await existingStock.update({
              productQuantity: (existingStock.productQuantity +=
                parseInt(productQuantity)),
            });
            return updatedStock;
          } else {
            const existingProduct = await Product.findOne({
              where: { productName: productName },
            });

            if (!existingProduct) {
              return {
                message: `Product with name ${productName} not found`,
              };
            }
            const createdStock = await Stocks.create({
              productID: product.productID,
              productName,
              productQuantity,
              purchasePrice: purchasePrice || null,
              manufacturedDate,
              expiryDate,
              purchasedDate,
              purchaseID: null,
            });
            return createdStock;
          }
        } catch (err) {
          res.status(500).json({ message: err.message });
          return null;
        }
      })
    );

    res.status(201).json({
      message: "Stocks Created Successfully!",
      stocks: stocksItems,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET -> localhost:5000/api/v1/stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stocks.findAll();
    res.status(200).json({ message: "Fetch stocks details", stocks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT -> localhost:5000/api/v1/stocks/:id
exports.updateStocks = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      productQuantity,
      purchasePrice,
      manufacturedDate,
      expiryDate,
      purchasedDate,
    } = req.body;

    const stocks = await Stocks.findByPk(id);
    if (!stocks) {
      return res.status(404).json({ message: "Stock not found" });
    }
    const stockUpdate = await stocks.update({
      productName,
      productQuantity,
      purchasePrice,
      manufacturedDate,
      expiryDate,
      purchasedDate,
    });
    res.status(200).json({
      message: "Stock updated successfully",
      updateStock: stockUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE -> localhost:5000/api/v1/stocks/:id
exports.deleteStocks = async (req, res) => {
  try {
    const { id } = req.params;
    const stocks = await Stocks.findByPk(id);
    if (!stocks) {
      return res.status(404).json({ message: "Stock not found" });
    }
    const stockDelete = await stocks.destroy();
    res.status(200).json({
      message: "Stock deleted successfully",
      deleteStock: stockDelete,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET -> localhost:5000/api/v1/stocks/query
exports.queryStocks = async (req, res) => {
  try {
    // Query parameters
    const { keyword, page = 1, limit = 6, sort = "ASC" } = req.query;

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    // Search condition
    const searchCondition = keyword
      ? {
          [Op.or]: [{ productName: { [Op.like]: `%${keyword}%` } }],
        }
      : {};

    // Sorting by ASC or DESC
    const sortOrder = sort === "desc" ? "DESC" : "ASC";

    // search, pagination, and sorting
    const { count, rows: stocks } = await Stocks.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [["createdAt", sortOrder]],
    });

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      stocks,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalCount: count,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
