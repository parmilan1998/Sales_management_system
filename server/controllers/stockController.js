const { Op } = require("sequelize");
const Stocks = require("../models/stocks");
const Product = require("../models/products");

// POST -> localhost:5000/api/v1/stocks
exports.createStocks = async (req, res) => {
  try {
    let stocksData = req.body;

    // Check if stocksData is an array or not
    if (!Array.isArray(stocksData)) {
      stocksData = [stocksData]; // Convert single object to array
    }

    const createdStocks = await Promise.all(
      stocksData.map(async (stock) => {
        const {
          productName,
          productQuantity,
          purchasePrice,
          manufacturedDate,
          expiryDate,
          purchasedDate,
        } = stock;

        if (
          !productName ||
          !productQuantity ||
          !manufacturedDate ||
          !expiryDate
        ) {
          return res
            .status(400)
            .json({ message: "Fill all the required fields!" });
        }

        const product = await Product.findOne({
          where: { productName },
        });

        if (!product) {
          return res
            .status(404)
            .json({ message: `Product ${productName} not found` });
        }

        if (purchasedDate < manufacturedDate) {
          return res.status(400).json({
            message: `Check the purchasedDate for ${productName}`,
          });
        }

        if (manufacturedDate > expiryDate) {
          return res.status(400).json({
            message: `Check the manufacturedDate for ${productName}`,
          });
        }

        // Check if stock already exists
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
          // Update existing stock quantity
          const updatedStock = await existingStock.update({
            productQuantity:
              existingStock.productQuantity + parseInt(productQuantity),
          });

          return {
            message: `Stock for ${productName} updated successfully`,
            stocks: updatedStock,
          };
        }

        // Create new stock entry
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

        return {
          message: `Stock for ${productName} created successfully`,
          stocks: createdStock,
        };
      })
    );

    res.status(201).json({
      message: "Stocks Created/Updated Successfully!",
      stocks: createdStocks,
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
    let stocksData = req.body;

    // Check if stocksData is an array or not
    if (!Array.isArray(stocksData)) {
      stocksData = [stocksData]; // Convert single object to array
    }

    const updatedStocks = await Promise.all(
      stocksData.map(async (stock) => {
        const {
          productName,
          productQuantity,
          purchasePrice,
          manufacturedDate,
          expiryDate,
          purchasedDate,
        } = stock;

        // If stock object has an id property, use it; otherwise, use the id from req.params
        const stockID = stock.id || id;

        const existingStock = await Stocks.findByPk(stockID);

        if (!existingStock) {
          throw new Error(`Stock with ID ${stockID} not found`);
        }

        const updatedStock = await existingStock.update({
          productName,
          productQuantity,
          purchasePrice,
          manufacturedDate,
          expiryDate,
          purchasedDate,
        });

        return {
          message: `Stock with ID ${stockID} updated successfully`,
          updatedStock: updatedStock,
        };
      })
    );

    res.status(200).json({
      message: "Stocks Updated Successfully!",
      stocks: updatedStocks,
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
