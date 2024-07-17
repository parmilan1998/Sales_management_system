const { Op } = require("sequelize");
const Stocks = require("../models/stocks");
const Product = require("../models/products");
const axios = require("axios");
const Unit = require("../models/unit");

// POST -> localhost:5000/api/v1/stocks
exports.createStocks = async (req, res) => {
  try {
    const {
      productName,
      productQuantity,
      purchasePrice,
      manufacturedDate,
      expiryDate,
      purchasedDate,
    } = req.body;

    if (
      !productName ||
      !productQuantity ||
      !manufacturedDate ||
      !expiryDate ||
      !purchasedDate
    ) {
      return res.status(400).json({ message: "Fill all the required fields!" });
    }

    const product = await Product.findOne({
      where: { productName },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existingStock = await Stocks.findOne({
      where: {
        productID: product.productID,
        productName,
        purchasePrice,
        manufacturedDate,
        expiryDate,
        purchasedDate,
      },
    });

    if (existingStock) {
      const updatedStock = await existingStock.update({
        productQuantity:
          existingStock.productQuantity + parseInt(productQuantity),
      });
      // Emit event for stock update
      const io = req.app.get("socketio");

      // Fetch and emit the updated total product quantity
      const totalQuantity = await Stocks.sum("productQuantity");
      io.emit("totalProductQuantityUpdated", totalQuantity);

      // Fetch and emit low stock products
      try {
        const lowStockResponse = await axios.get(
          "http://localhost:5000/api/v1/notification/low-stock"
        );
        io.emit("lowStockUpdated", lowStockResponse.data);
      } catch (err) {
        console.error(
          "Error fetching low stock data:",
          err.response ? err.response.data : err.message
        );
      }

      return res.status(201).json({
        message: "Stocks updated Successfully!",
        stocks: updatedStock,
      });
    }

    if (purchasedDate < manufacturedDate) {
      return res.status(400).json({
        message: `Check the purchasedDate`,
      });
    }

    if (manufacturedDate > expiryDate) {
      return res.status(400).json({
        message: `Check the manufacturedDate`,
      });
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

    // Emit event for stock update
    const io = req.app.get("socketio");

    // Fetch and emit the updated total product quantity
    const totalQuantity = await Stocks.sum("productQuantity");
    io.emit("totalProductQuantityUpdated", totalQuantity);

    // Fetch and emit low stock products
    try {
      const lowStockResponse = await axios.get(
        "http://localhost:5000/api/v1/notification/low-stock"
      );
      io.emit("lowStockUpdated", lowStockResponse.data);
    } catch (err) {
      console.error(
        "Error fetching low stock data:",
        err.response ? err.response.data : err.message
      );
    }

    return res.status(201).json({
      message: "Stocks Created Successfully!",
      stocks: createdStock,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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

    // Emit event for stock update
    const io = req.app.get("socketio");

    // Fetch and emit the updated total product quantity
    const totalQuantity = await Stocks.sum("productQuantity");
    io.emit("totalProductQuantityUpdated", totalQuantity);

    // Fetch and emit low stock products
    try {
      const lowStockResponse = await axios.get(
        "http://localhost:5000/api/v1/notification/low-stock"
      );
      io.emit("lowStockUpdated", lowStockResponse.data);
    } catch (err) {
      console.error(
        "Error fetching low stock data:",
        err.response ? err.response.data : err.message
      );
    }

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

    // Emit event for stock update
    const io = req.app.get("socketio");

    // Fetch and emit the updated total product quantity
    const totalQuantity = await Stocks.sum("productQuantity");
    io.emit("totalProductQuantityUpdated", totalQuantity);

    // Fetch and emit low stock products
    try {
      const lowStockResponse = await axios.get(
        "http://localhost:5000/api/v1/notification/low-stock"
      );
      io.emit("lowStockUpdated", lowStockResponse.data);
    } catch (err) {
      console.error(
        "Error fetching low stock data:",
        err.response ? err.response.data : err.message
      );
    }

    res.status(200).json({
      message: "Stock deleted successfully",
      deleteStock: stockDelete,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// GET -> localhost:5000/api/v1/stocks/query
exports.queryStocks = async (req, res) => {
  try {
    // Query parameters
    const {
      keyword,
      page = 1,
      limit = 6,
      sort = "ASC",
      sortBy = "ASC",
    } = req.query;

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    // Search condition
    const searchConditions = [];

    if (keyword) {
      searchConditions.push({ productName: { [Op.like]: `%${keyword}%` } });

      if (isValidDate(keyword)) {
        searchConditions.push({ expiryDate: { [Op.eq]: keyword } });
      }
    }

    const searchCondition =
      searchConditions.length > 0 ? { [Op.or]: searchConditions } : {};

    // Sorting by ASC or DESC
    const sortOrder = sort === "DESC" ? "DESC" : "ASC";
    const sortDate = sortBy === "DESC" ? "DESC" : "ASC";

    // search, pagination, and sorting
    const { count, rows: stocks } = await Stocks.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [
        ["productName", sortOrder],
        ["expiryDate", sortDate],
      ],
      include: [
        {
          model: Unit,
          attributes: ["unitType"],
          required: true,
        },
      ],
    });

    const stocksWithUnitType = stocks.map((stock) => ({
      productName: stock.productName,
      productQuantity: stock.productQuantity,
      purchasePrice: stock.purchasePrice,
      manufacturedDate: stock.manufacturedDate,
      expiryDate: stock.expiryDate,
      purchasedDate: stock.purchasedDate,
      unitType: stock.Unit.unitType,
    }));

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      stocks: stocksWithUnitType,
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

// GET -> localhost:5000/api/v1/stocks/total
exports.getTotalProductQuantity = async (req, res) => {
  try {
    const totalQuantity = await Stocks.sum("productQuantity");
    res.status(200).json({ totalQuantity });
  } catch (error) {
    console.error("Error fetching total product quantity:", error);
    res.status(500).json({
      message: "Error fetching total product quantity",
      error: error.message,
    });
  }
};
