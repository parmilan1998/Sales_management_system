const { Op } = require("sequelize");
const Reports = require("../models/reports");
const Sales = require("../models/sales");
const Purchase = require("../models/purchase");
const Stocks = require("../models/stocks");
const SalesDetail = require("../models/salesDetails");
const SalesReport = require("../models/salesReport");

// POST -> localhost:5000/api/v1/reports
exports.createReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        message: "startDate must be less than or equal to endDate",
      });
    }

    // Calculate beginning inventory
    const beginningInventory = await Stocks.findAll({
      attributes: ["purchasePrice", "productQuantity"],
      where: {
        purchasedDate: {
          [Op.lte]: start,
        },
      },
    });

    const beginningInventoryCost = beginningInventory.reduce((total, stock) => {
      return total + stock.purchasePrice * stock.productQuantity;
    }, 0);

    // Calculate purchases cost during the period
    const purchases = await Purchase.findAll({
      attributes: ["purchasePrice", "purchaseQuantity"],
      where: {
        purchasedDate: {
          [Op.between]: [start, end],
        },
      },
    });

    const purchasesCost = purchases.reduce((total, purchase) => {
      return total + purchase.purchasePrice * purchase.purchaseQuantity;
    }, 0);

    // Calculate ending inventory cost
    const endingInventory = await Stocks.findAll({
      attributes: ["purchasePrice", "productQuantity"],
      where: {
        purchasedDate: {
          [Op.lte]: end,
        },
      },
    });

    const endingInventoryCost = endingInventory.reduce((total, stock) => {
      return total + stock.purchasePrice * stock.productQuantity;
    }, 0);

    // Calculate total revenue within the specified period
    const totalRevenue = await SalesDetail.sum("revenue", {
      where: {
        "$sale.soldDate$": {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Sales,
          as: "sale",
          attributes: []
        },
      ],
    });

    // Calculate total COGS (Cost of Goods Sold)
    const totalCOGS =
      beginningInventoryCost + purchasesCost - endingInventoryCost;

    // Calculate gross profit
    const grossProfit = totalRevenue - totalCOGS;

    // Create a new report
    const newReport = await Reports.create({
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalCOGS: parseFloat(totalCOGS.toFixed(2)),
      grossProfit: parseFloat(grossProfit.toFixed(2)),
      startDate: startDate,
      endDate: endDate,
    });

    const salesInPeriod = await Sales.findAll({
      where: {
        soldDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Create entries in SalesReport to link the sales to the new report
    const salesReportEntries = salesInPeriod.map((sale) => ({
      reportID: newReport.reportID,
      salesID: sale.salesID,
    }));

    await SalesReport.bulkCreate(salesReportEntries);

    res.status(201).json({
      message: "Report created successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({
      message: "An error occurred while creating the report",
      error: error.message,
    });
  }
};

// PUT -> localhost:5000/api/v1/reports/:id
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        message: "startDate and endDate are required",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        message: "startDate must be less than or equal to endDate",
      });
    }

    // Fetch the report to be updated
    const report = await Reports.findByPk(id);
    if (!report) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    // Calculate beginning inventory cost
    const beginningInventory = await Stocks.findAll({
      attributes: ["purchasePrice", "productQuantity"],
      where: {
        purchasedDate: {
          [Op.lte]: start,
        },
      },
    });

    const beginningInventoryCost = beginningInventory.reduce((total, stock) => {
      return total + stock.purchasePrice * stock.productQuantity;
    }, 0);

    // Calculate purchases cost during the period
    const purchases = await Purchase.findAll({
      attributes: ["purchasePrice", "purchaseQuantity"],
      where: {
        purchasedDate: {
          [Op.between]: [start, end],
        },
      },
    });

    const purchasesCost = purchases.reduce((total, purchase) => {
      return total + purchase.purchasePrice * purchase.purchaseQuantity;
    }, 0);

    // Calculate ending inventory cost
    const endingInventory = await Stocks.findAll({
      attributes: ["purchasePrice", "productQuantity"],
      where: {
        purchasedDate: {
          [Op.lte]: end,
        },
      },
    });

    const endingInventoryCost = endingInventory.reduce((total, stock) => {
      return total + stock.purchasePrice * stock.productQuantity;
    }, 0);

    // Calculate total revenue within the specified period
    const totalRevenue = await SalesDetail.sum("revenue", {
      where: {
        "$sale.soldDate$": {
          [Op.between]: [start, end],
        },
      },
      include: [
        {
          model: Sales,
          as: "sale",
          attributes: [],
        },
      ],
      group: ["sale.salesID"], 
    });

    // Calculate total COGS (Cost of Goods Sold)
    const totalCOGS =
      beginningInventoryCost + purchasesCost - endingInventoryCost;

    // Calculate gross profit
    const grossProfit = totalRevenue - totalCOGS;

    // Update the report
    await report.update({
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalCOGS: parseFloat(totalCOGS.toFixed(2)),
      grossProfit: parseFloat(grossProfit.toFixed(2)),
      startDate: startDate,
      endDate: endDate,
    });
    // Clear existing SalesReport entries for the report
    await SalesReport.destroy({
      where: {
        reportID: id,
      },
    });

    // Retrieve sales within the new period
    const salesInPeriod = await Sales.findAll({
      where: {
        soldDate: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    // Create new entries in SalesReport to link the sales to the updated report
    const salesReportEntries = salesInPeriod.map((sale) => ({
      reportID: id,
      salesID: sale.salesID,
    }));

    await SalesReport.bulkCreate(salesReportEntries);

    res.status(200).json({
      message: "Report updated successfully",
      report: report,
    });
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({
      message: "An error occurred while updating the report",
      error: error.message,
    });
  }
};

// DELETE -> localhost:5000/api/v1/reports/:id
exports.deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Reports.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Delete associated SalesReport entries
    await SalesReport.destroy({
      where: {
        reportID: id,
      },
    });

    // Delete the main report record
    await report.destroy();

    res.status(200).json({
      message: `Report deleted successfully`,
      deletedReport: report,
    });
  } catch (error) {
    console.error("Error deleting report:", error);
    res.status(500).json({ message: "An error occurred while deleting the report" });
  }
};

// GET -> localhost:5000/api/v1/reports/list
exports.getAllReport = async (req, res) => {
  try {
    const reports = await Reports.findAll();
    res.status(200).json({
      reports: reports,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// GET -> localhost:5000/api/v1/reports/query
exports.queryReport = async (req, res) => {
  try {
    // Query parameters
    const { page = 1, limit = 6, sort = "ASC", startDate, endDate } = req.query;

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    // Search condition
    const searchCondition = {};
    
    if (startDate && endDate) {
     
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        return res.status(400).json({
          message: "startDate must be less than or equal to endDate",
        });
      }
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999); // Set the end date to the end of the day
      
      searchCondition.createdAt = {
        [Op.between]: [start, end]
      };
    }

    // Sorting by ASC or DESC
    const sortOrder = sort === "desc" ? "DESC" : "ASC";

    // search, pagination, and sorting
    const { count, rows: reports } = await Reports.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [["createdAt", sortOrder]],
    });

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      reports,
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





