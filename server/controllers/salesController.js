const { Sequelize, Op } = require("sequelize");
const Sales = require("../models/sales");
const Product = require("../models/products");
const Stocks = require("../models/stocks");
const SalesDetail = require("../models/salesDetails");
const axios = require("axios");
// POST -> localhost:5000/api/v1/sales
exports.createSales = async (req, res) => {
  try {
    let sales = req.body;

    // Ensure sales is an array
    if (!Array.isArray(sales)) {
      sales = [sales];
    }

    const createdSales = [];

    for (const sale of sales) {
      const { custName, customerContact, soldDate, products } = sale;

      const productList = Array.isArray(products) ? products : [products];
      // Create the main sales record
      const newSale = await Sales.create({
        custName: custName,
        customerContact: customerContact,
        soldDate: soldDate,
        totalRevenue: 0, // Initial total revenue
      });

      let totalRevenue = 0;

      // Process each product in the sale
      for (const productSale of productList) {
        const { productName, salesQuantity } = productSale;

        // Find the product in the Product table
        const product = await Product.findOne({
          where: { productName },
        });

        if (!product) {
          return res
            .status(404)
            .json({ message: `Product '${productName}' not found` });
        }

        const { productID, unitPrice } = product;
        const revenue = unitPrice * salesQuantity;

        // Find stock entries for the product
        const stocks = await Stocks.findAll({
          where: { productID },
          order: [["purchasedDate", "ASC"]],
        });

        let remainingQuantity = salesQuantity;
        let stockDetails = [];

        // Deduct sales quantity from available stock
        for (const stock of stocks) {
          if (remainingQuantity <= 0) break;

          let usedQuantity = Math.min(stock.productQuantity, remainingQuantity);
          stock.productQuantity -= usedQuantity;
          remainingQuantity -= usedQuantity;

          // Save updated stock quantity
          await stock.save();

          // Track stock details for SalesDetail creation
          stockDetails.push({ stockID: stock.stockID, usedQuantity });
        }

        if (remainingQuantity > 0) {
          return res.status(404).json({
            message: `Insufficient quantity available for product '${productName}'`,
          });
        }

        // Create SalesDetail record
        await SalesDetail.create({
          salesID: newSale.salesID,
          productID: productID,
          stockID: stockDetails[0].stockID, // Assuming first stock used for simplicity
          salesQuantity: salesQuantity,
          unitPrice: unitPrice,
          revenue: revenue,
          productName: productName,
        });

        totalRevenue += revenue; // Accumulate revenue for the sale
      }

      // Update total revenue for the sale
      newSale.totalRevenue = totalRevenue;
      await newSale.save();

      createdSales.push(newSale);
    }

    // Emit event for real-time updates
    const io = req.app.get("socketio");

    // Fetch and emit the updated sales count
    const count = await Sales.count();
    io.emit("saleCount", count);

    // Fetch and emit the updated total product quantity
    const totalQuantity = await Stocks.sum("productQuantity");
    io.emit("totalProductQuantityUpdated", totalQuantity);

    // Fetch and emit all sales data
    try {
      const { data: salesData } = await axios.get(
        "http://localhost:5000/api/v1/sales/sort",
        {
          params: {
            sortType: "year",
            year: new Date().getFullYear(),
          },
        }
      );

      io.emit("salesUpdated", salesData);
    } catch (err) {
      console.error(
        "Error fetching sales data:",
        err.response ? err.response.data : err.message
      );
    }

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

    // Fetch and emit out of stock products
    try {
      const outOfStockResponse = await axios.get(
        "http://localhost:5000/api/v1/notification/out-of-stock"
      );
      io.emit("outOfStockUpdated", outOfStockResponse.data);
    } catch (err) {
      console.error(
        "Error fetching out of stock data:",
        err.response ? err.response.data : err.message
      );
    }

    res.status(201).json({
      message: "Sales added successfully",
      sales: createdSales,
    });
  } catch (error) {
    console.error("Error creating sales:", error);
    res
      .status(500)
      .json({ message: "Error carrying out sales", error: error.message });
  }
};

// GET -> localhost:5000/api/v1/sales/list
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sales.findAll({
      include: [
        {
          model: SalesDetail,
          as: "details",
          attributes: ["productName", "salesQuantity"],
        },
      ],
      order: [["soldDate", "DESC"]],
    });

    res.status(200).json(sales);
  } catch (error) {
    console.error("Error retrieving sales:", error.message);
    res
      .status(500)
      .json({ message: "Error retrieving sales", error: error.message });
  }
};

// PUT -> localhost:5000/api/v1/sales/:id
exports.updateSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { custName, customerContact, soldDate, products } = req.body;

    const existingSale = await Sales.findByPk(id);
    if (!existingSale) {
      return res
        .status(404)
        .json({ message: `Sales record with ID '${id}' not found` });
    }

    // Update basic sale details
    existingSale.custName = custName || existingSale.custName;
    existingSale.customerContact =
      customerContact || existingSale.customerContact;

    existingSale.soldDate = soldDate || existingSale.soldDate;

    // Remove old sales details and restore quantities
    const oldSalesDetails = await SalesDetail.findAll({
      where: { salesID: id },
    });

    for (const detail of oldSalesDetails) {
      const stock = await Stocks.findByPk(detail.stockID);
      stock.productQuantity += detail.salesQuantity;
      await stock.save();
    }
    await SalesDetail.destroy({ where: { salesID: id } });

    const saleDetails = await Promise.all(
      products.map(async (productSale) => {
        const { productName, salesQuantity } = productSale;

        // Find the product in the Product table
        const product = await Product.findOne({ where: { productName } });

        if (!product) {
          return res
            .status(404)
            .json({ message: `Product '${productName}' not found` });
        }

        const { unitPrice } = product;
        const calculatedTotalPrice = unitPrice * salesQuantity;

        // Find stock entries for the product
        const stocks = await Stocks.findAll({
          where: { productID: product.productID },
          order: [["purchasedDate", "ASC"]],
        });

        let remainingQuantity = salesQuantity;
        let stockDetails = [];

        for (const stock of stocks) {
          if (remainingQuantity <= 0) break;
          let usedQuantity = 0;

          if (stock.productQuantity >= remainingQuantity) {
            usedQuantity = remainingQuantity;
            stock.productQuantity -= remainingQuantity;
            remainingQuantity = 0;
          } else {
            usedQuantity = stock.productQuantity;
            remainingQuantity -= stock.productQuantity;
            stock.productQuantity = 0;
          }

          await stock.save();

          stockDetails.push({ stockID: stock.stockID, usedQuantity });
        }

        if (remainingQuantity > 0) {
          return res.status(404).json({
            message: `Insufficient quantity available for product '${productName}'`,
          });
        }

        // Create the sales details records
        await Promise.all(
          stockDetails.map(async (stockDetail) => {
            await SalesDetail.create({
              salesID: existingSale.salesID,
              productID: product.productID,
              stockID: stockDetail.stockID,
              productName: product.productName,
              salesQuantity: stockDetail.usedQuantity,
              unitPrice: unitPrice,
              revenue: unitPrice * stockDetail.usedQuantity,
            });
          })
        );

        return {
          salesID: existingSale.salesID,
          productID: product.productID,
          productName: product.productName,
          salesQuantity,
          unitPrice,
          revenue: calculatedTotalPrice,
        };
      })
    );

    // Calculate total revenue for the sale
    const totalRevenue = saleDetails.reduce(
      (total, detail) => total + detail.revenue,
      0
    );
    existingSale.totalRevenue = totalRevenue;
    await existingSale.save();

    // Emit event for real-time updates
    const io = req.app.get("socketio");

    // Fetch and emit all sales data
    try {
      const { data: salesData } = await axios.get(
        "http://localhost:5000/api/v1/sales/sort",
        {
          params: {
            sortType: "year",
            year: new Date().getFullYear(),
          },
        }
      );

      io.emit("salesUpdated", salesData);
    } catch (err) {
      console.error(
        "Error fetching sales data:",
        err.response ? err.response.data : err.message
      );
    }

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

    // Fetch and emit out of stock products
    try {
      const outOfStockResponse = await axios.get(
        "http://localhost:5000/api/v1/notification/out-of-stock"
      );
      io.emit("outOfStockUpdated", outOfStockResponse.data);
    } catch (err) {
      console.error( 
        "Error fetching out of stock data:",
        err.response ? err.response.data : err.message
      );
    }

    res.status(200).json({
      message: `Sales record with ID '${id}' updated successfully`,
      updatedSale: existingSale,
    });
  } catch (e) {
    console.error("Error updating sales:", e);
    res.status(500).json({ message: "Error updating sales", error: e.message });
  }
};

// GET -> localhost:5000/api/v1/sales/:id
exports.getSalesById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the sales record
    const sales = await Sales.findByPk(id);

    if (!sales) {
      return res.status(404).json({ message: "Sales not found" });
    }

    const saleDetails = await SalesDetail.findAll({
      attributes: ["productName", "salesQuantity"],
      where: {
        salesID: id,
      },
    });

    const products = saleDetails.map((detail) => ({
      productName: detail.productName,
      salesQuantity: detail.salesQuantity,
    }));

    const response = {
      totalRevenue: sales.totalRevenue,
      custName: sales.custName,
      customerContact: sales.customerContact,
      soldDate: sales.soldDate,
      details: products,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res
      .status(500)
      .json({ message: "Error retrieving sales", error: error.message });
  }
};

// // DELETE -> localhost:5000/api/v1/sales/:id
// exports.deleteSales = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const sale = await Sales.findByPk(id);
//     if (!sale) {
//       return res.status(404).json({ message: "Sale not found" });
//     }

//     // Find associated SalesDetail entries
//     const salesDetails = await SalesDetail.findAll({ where: { salesID: id } });

//     // Delete associated SalesDetail entries
//     for (const detail of salesDetails) {
//       await detail.destroy();
//     }
//     // Delete the main sale record
//     await sale.destroy();

//     res.status(200).json({
//       message: `Sales deleted successfully`,
//       deletedSale: sale,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting product" });
//   }
// };

const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// GET -> localhost:5000/api/v1/sales/query
exports.querySales = async (req, res) => {
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
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const offset = (parsedPage - 1) * parsedLimit;

    // Search condition
    const searchConditions = [];
    let productName = keyword;

    console.log(keyword);

    if (keyword) {
      searchConditions.push({ custName: { [Op.like]: `%${keyword}%` } });

      // Add condition for soldDate if keyword is a valid date
      if (isValidDate(keyword)) {
        searchConditions.push({ soldDate: { [Op.eq]: keyword } });
      }
    }

    const searchCondition =
      searchConditions.length > 0 ? { [Op.or]: searchConditions } : {};

    // Sorting by ASC or DESC
    const sortOrder = sort === "DESC" ? "DESC" : "ASC";
    const sortDate = sortBy === "DESC" ? "DESC" : "ASC";

    // Querying Sales with included SalesDetail
    const { count: countCustomer, rows: salesCustomer } =
      await Sales.findAndCountAll({
        include: {
          model: SalesDetail,
          as: "details",
          attributes: ["productName", "salesQuantity"],
        },
        where: searchCondition,
        offset,
        limit: parsedLimit,
        order: [
          ["custName", sortOrder],
          ["soldDate", sortDate],
        ],
      });

    const { count: countProduct, rows: salesProduct } =
      await Sales.findAndCountAll({
        include: {
          model: SalesDetail,
          as: "details",
          attributes: ["productName", "salesQuantity"],
          where: {
            productName: { [Op.like]: `%${productName}%` },
          },
        },

        offset,
        limit: parsedLimit,
        order: [
          ["custName", sortOrder],
          ["soldDate", sortDate],
        ],
      });

    let count = countCustomer > 0 ? countCustomer : countProduct;
    let sales = countCustomer > 0 ? salesCustomer : salesProduct;

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      sales,
      pagination: {
        currentPage: parsedPage,
        totalPages,
        totalCount: count,
      },
    });
  } catch (error) {
    console.log("Error querying sales:", error.message);
    res
      .status(500)
      .json({ message: "Error querying sales", error: error.message });
  }
};

// GET -> localhost:5000/api/v1/sales/sort
exports.salesSort = async (req, res) => {
  const { sortType, year } = req.query;

  try {
    let salesData;

    if (sortType === "month" && year) {
      salesData = await Sales.findAll({
        attributes: [
          [Sequelize.fn("MONTH", Sequelize.col("soldDate")), "month"],
          [Sequelize.fn("SUM", Sequelize.col("totalRevenue")), "totalRevenue"],
        ],
        where: {
          soldDate: {
            [Op.gte]: new Date(`${year}-01-01`),
            [Op.lte]: new Date(`${year}-12-31`),
          },
        },
        group: ["month"],
        order: [[Sequelize.fn("MONTH", Sequelize.col("soldDate")), "ASC"]],
      });
    } else if (sortType === "year") {
      salesData = await Sales.findAll({
        attributes: [
          [Sequelize.fn("YEAR", Sequelize.col("soldDate")), "year"],
          [Sequelize.fn("SUM", Sequelize.col("totalRevenue")), "totalRevenue"],
        ],
        group: ["year"],
        order: [[Sequelize.fn("YEAR", Sequelize.col("soldDate")), "ASC"]],
      });
    } else {
      return res.status(400).json({ message: "Invalid sortType or year" });
    }

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({
      message: "An error occurred while fetching sales data",
      error: error.message,
    });
  }
};

// PUT -> localhost:5000/api/v1/sales/return/:salesID/:productID
exports.returnProductFromSale = async (req, res) => {
  const { salesID, productID } = req.params;
  const { returnQuantity } = req.body;

  try {
    // Find the existing sale record
    const existingSale = await Sales.findByPk(salesID);
    if (!existingSale) {
      return res
        .status(404)
        .json({ message: `Sales record with ID '${salesID}' not found` });
    }

    // Find the sales detail for the specific product in the sale
    const salesDetail = await SalesDetail.findOne({
      where: { salesID: salesID, productID: productID },
    });

    if (!salesDetail) {
      return res.status(404).json({
        message: `Product with ID '${productID}' not found in sales record '${salesID}'`,
      });
    }

    // Find the associated stock entry
    const stock = await Stocks.findByPk(salesDetail.stockID);
    if (!stock) {
      return res.status(404).json({
        message: `Stock entry for product '${salesDetail.productName}' not found`,
      });
    }
    // Validate return quantity
    if (returnQuantity <= 0 || returnQuantity > salesDetail.salesQuantity) {
      return res.status(400).json({
        message: `Invalid return quantity for product '${salesDetail.productName}'`,
      });
    }

    // Update stock quantity by adding back returned quantity
    stock.productQuantity += returnQuantity;
    await stock.save();

    // Adjust sales detail salesQuantity
    salesDetail.salesQuantity -= returnQuantity;

    // Recalculate the revenue based on the remaining salesQuantity
    salesDetail.revenue = salesDetail.unitPrice * salesDetail.salesQuantity;
    await salesDetail.save();

    // Update the total revenue for the sale
    const updatedSaleDetails = await SalesDetail.findAll({
      where: { salesID: salesID },
    });

    const totalRevenue = updatedSaleDetails.reduce(
      (total, detail) => total + detail.revenue,
      0
    );
    existingSale.totalRevenue = totalRevenue;
    await existingSale.save();

    // Emit event to notify clients about the updated sale
    req.app.get("socketio").emit("salesUpdated", existingSale);

    res.status(200).json({
      message: `Returned ${returnQuantity} units of product with ID '${productID}' from sales record '${salesID}' successfully`,
      updatedSale: existingSale,
    });
  } catch (error) {
    console.error("Error returning product from sales:", error);
    res.status(500).json({
      message: "Error returning product from sales",
      error: error.message,
    });
  }
};

// GET -> localhost:5000/api/v1/sales/count
exports.getSalesCount = async (req, res) => {
  try {
    const count = await Sales.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching sales count:", error);
    res
      .status(500)
      .json({ message: "Error fetching sales count", error: error.message });
  }
};
