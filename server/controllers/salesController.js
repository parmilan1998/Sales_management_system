const { Sequelize, Op } = require("sequelize");
const Sales = require("../models/sales");
const Product = require("../models/products");
const Stocks = require("../models/stocks");
const SalesDetail = require("../models/salesDetails");
const axios = require("axios");
const Unit = require("../models/unit");

// POST -> localhost:5000/api/v1/sales
exports.createSales = async (req, res) => {
  try {
    let sales = req.body;

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
        totalRevenue: 0,
      });

      let totalRevenue = 0;
      const productDetails = [];

      // Process each product in the sale
      for (const productSale of productList) {
        const { productName, salesQuantity,subTotal } = productSale;

        // Find the product in the Product table
        const product = await Product.findOne({
          where: { productName },
        });

        if (!product) {
          return res
            .status(404)
            .json({ message: `Product '${productName}' not found` });
        }

        const { productID, unitPrice, unitID } = product;
    
        const revenue = subTotal;

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

        // Fetch unit type from the Unit table
        const unit = await Unit.findOne({
          where: { unitID: unitID },
        });

        if (!unit) {
          return res
            .status(404)
            .json({ message: `Unit for product '${productName}' not found` });
        }

        // Create SalesDetail record
        await SalesDetail.create({
          salesID: newSale.salesID,
          productID: productID,
          stockID: stockDetails[0].stockID,
          salesQuantity: salesQuantity,
          unitPrice: unitPrice,
          revenue: revenue,
          productName: productName,
          unitID: unitID,
        });

        totalRevenue += revenue;

        // Add product details to the response
        productDetails.push({
          productName: productName,
          salesQuantity: salesQuantity,
          unitType: unit.unitType,
        });
      }

      // Update total revenue for the sale
      newSale.totalRevenue = totalRevenue;
      await newSale.save();

      // Add the sale details to the created sales array
      createdSales.push({
        salesID: newSale.salesID,
        custName: newSale.custName,
        customerContact: newSale.customerContact,
        soldDate: newSale.soldDate,
        totalRevenue: newSale.totalRevenue,
        products: productDetails,
      });
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

        // Validate salesQuantity
        if (salesQuantity < 1) {
          return res.status(400).json({
            message: `Invalid sales quantity for product '${productName}'`,
          });
        }

        // Find the product in the Product table
        const product = await Product.findOne({ where: { productName } });
        if (!product) {
          return res
            .status(404)
            .json({ message: `Product '${productName}' not found` });
        }

        // Fetch unit ID and unit type from the Unit table
        const unit = await Unit.findByPk(product.unitID);
        if (!unit) {
          return res
            .status(404)
            .json({ message: `Unit not found for product '${productName}'` });
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
              unitID: unit.unitID,
              productName: product.productName,
              salesQuantity: stockDetail.usedQuantity,
              unitPrice: unitPrice,
              revenue: unitPrice * stockDetail.usedQuantity,
            });
          })
        );

        return {
          productName: product.productName,
          salesQuantity,
          unitType: unit.unitType,
          unitPrice, // Include unitPrice for revenue calculation
        };
      })
    );

    // Calculate total revenue for the sale
    const totalRevenue = saleDetails.reduce(
      (total, detail) => total + detail.unitPrice * detail.salesQuantity,
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

    res.status(200).json({
      message: `Sales record with ID '${id}' updated successfully`,
      sales: [
        {
          salesID: existingSale.salesID,
          custName: existingSale.custName,
          customerContact: existingSale.customerContact,
          soldDate: existingSale.soldDate,
          totalRevenue: existingSale.totalRevenue,
          products: saleDetails,
        },
      ],
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
        include: [
          {
            model: SalesDetail,
            as: "details",
            attributes: ["productName", "salesQuantity"],
            include: [
              {
                model: Unit,
                as: "unit",
                attributes: ["unitType"],
              },
            ],
          },
        ],
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
        include: [
          {
            model: SalesDetail,
            as: "details",
            attributes: ["productName", "salesQuantity"],
            where: {
              productName: { [Op.like]: `%${productName}%` },
            },
            include: [
              {
                model: Unit,
                as: "unit",
                attributes: ["unitType"],
              },
            ],
          },
        ],
        offset,
        limit: parsedLimit,
        order: [
          ["custName", sortOrder],
          ["soldDate", sortDate],
        ],
      });

    let count = countCustomer > 0 ? countCustomer : countProduct;
    let sales = countCustomer > 0 ? salesCustomer : salesProduct;

    const salesWithUnitType = sales.map((sale) => ({
      salesID: sale.salesID,
      custName: sale.custName,
      customerContact: sale.customerContact,
      soldDate: sale.soldDate,
      totalRevenue: sale.totalRevenue,
      details: sale.details.map((detail) => ({
        productName: detail.productName,
        salesQuantity: detail.salesQuantity,
        unitType: detail.unit.unitType,
      })),
    }));

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      sales: salesWithUnitType,
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

// // Function to calculate and update reorder levels
// exports.calculateAndUpdateReorderLevels = async () => {
//   try {
//     const products = await Product.findAll();
//     const currentYear = new Date().getFullYear();
//     const startDate = new Date(`${currentYear - 1}-01-01`);
//     const endDate = new Date(`${currentYear - 1}-12-31`);
//     const daysInYear = ((currentYear - 1) % 4 === 0) ? 366 : 365; // Check for leap year

//     for (const product of products) {
//       const salesData = await SalesDetail.findAll({
//         include: [{
//           model: Sales,
//           where: {
//             soldDate: {
//               [Op.between]: [startDate, endDate],
//             },
//           },
//           attributes: []
//         }],
//         where: { productID: product.productID },
//         attributes: [
//           [sequelize.fn("SUM", sequelize.col("salesQuantity")), "totalSales"],
//         ],
//         raw: true,
//       });

//       if (salesData.length > 0 && salesData[0].totalSales > 0) {
//         const totalSales = salesData[0].totalSales;
//         const averageDailyDemand = totalSales / daysInYear;
//         product.reOrderLevel = averageDailyDemand * product.deliveryTime;
//         await product.save();
//       }
//     }
//   } catch (error) {
//     console.error("Error calculating reorder levels:", error);
//   }
// };

// // Schedule the function to run every January 1 at midnight
// const scheduleReorderLevelUpdate = () => {
//   const now = new Date();
//   const nextJanFirst = new Date(now.getFullYear() + 1, 0, 1);
//   const delay = nextJanFirst - now;

//   setTimeout(() => {
//     exports.calculateAndUpdateReorderLevels();
//     setInterval(exports.calculateAndUpdateReorderLevels, 365 * 24 * 60 * 60 * 1000); // Every year
//   }, delay);
// };

// // Call the schedule function
// scheduleReorderLevelUpdate();
