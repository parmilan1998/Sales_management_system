const { Op } = require("sequelize");
const Stocks = require("../models/stocks");
const Product = require("../models/products");
const Purchase = require("../models/purchase");

// POST -> localhost:5000/api/v1/stocks
exports.createStocks = async (req, res) => {};

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
exports.updateStocks = async (req, res) => {};

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
exports.queryStocks = async (req, res) => {};
