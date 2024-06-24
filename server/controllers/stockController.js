const { Op } = require("sequelize");
const Stocks = require("../models/stocks");
const Product = require("../models/products");
const Purchase = require("../models/purchase");

// POST -> localhost:5000/api/v1/stocks
exports.createStocks = async (req, res) => {
  try {
    const stocks = req.body;

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
          const product = await Product.findOne({
            where: {
              productName: productName,
            },
          });

          if (!product) {
            errors.push(`Product '${productName}' not found`);
            return null;
          }

          const createdStock = await Stocks.create({
            productID: product.productID,
            productName,
            productQuantity,
            purchasePrice,
            manufacturedDate,
            expiryDate,
            purchasedDate,
            purchaseID: null,
          });

          return createdStock;
        } catch (err) {
          res.status(500).json({ message: err.message });
          return null;
        }
      })
    );

    res.status(201).json({
      message: "Stocks Created Successfully!",
      stocks: stocksItems.filter((stock) => stock !== null),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET -> localhost:5000/api/v1/stocks
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stocks.findAll();
    res.status(200).json(stocks);
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
    // console.log("Query Params:", { keyword, page, limit, sort });

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;
    // console.log("Pagination:", { parsedPage, parsedLimit, offset });

    // Search condition
    const searchCondition = keyword
      ? {
          [Op.or]: [
            { purchaseVendor: { [Op.like]: `%${keyword}%` } },
            { productName: { [Op.like]: `%${keyword}%` } },
          ],
        }
      : {};
    // console.log("Where Clause:", searchCondition);

    // Sorting by ASC or DESC
    const sortOrder = sort === "desc" ? "DESC" : "ASC";
    // console.log(sortOrder);

    // search, pagination, and sorting
    const { count, rows: purchases } = await Purchase.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [["createdAt", sortOrder]],
    });

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      purchases,
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
