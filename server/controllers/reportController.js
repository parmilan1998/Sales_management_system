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
    const { periodStart, periodEnd } = req.body;

    if (!periodStart || !periodEnd) {
      return res.status(400).json({
        message: "periodStart and periodEnd are required",
      });
    }

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

    // Calculate beginning inventory
    const beginningInventory = await Stocks.findAll({
      attributes: ["purchasePrice", "productQuantity"],
      where: {
        purchasedDate: {
          [Op.lte]: startDate,
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
          [Op.between]: [startDate, endDate],
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
          [Op.lte]: endDate,
        },
      },
    });

    const endingInventoryCost = endingInventory.reduce((total, stock) => {
      return total + stock.purchasePrice * stock.productQuantity;
    }, 0);

    // Calculate total revenue within the specified period
    const totalRevenue = await SalesDetail.sum("revenue", {
      where: {
        "$Sale.soldDate$": {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Sales,
          as: "sale",
          attributes: []
        },
      ],
      group: ['sale.salesID'],
    });

    // Calculate total COGS (Cost of Goods Sold)
    const totalCOGS =
      beginningInventoryCost + purchasesCost - endingInventoryCost;

    // Calculate gross profit
    const grossProfit = totalRevenue - totalCOGS;

    const roundedTotalRevenue = parseFloat(totalRevenue.toFixed(2)) ;
    const roundedTotalCOGS = parseFloat(totalCOGS.toFixed(2));
    const roundedGrossProfit = parseFloat(grossProfit.toFixed(2));

    // Create a new report
    const newReport = await Reports.create({
      totalRevenue: roundedTotalRevenue,
      totalCOGS: roundedTotalCOGS,
      grossProfit: roundedGrossProfit,
      periodStart: startDate,
      periodEnd: endDate,
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
    const { periodStart, periodEnd } = req.body;

    if (!periodStart || !periodEnd) {
      return res.status(400).json({
        message: "periodStart and periodEnd are required",
      });
    }

    const startDate = new Date(periodStart);
    const endDate = new Date(periodEnd);

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
          [Op.lte]: startDate,
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
          [Op.between]: [startDate, endDate],
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
          [Op.lte]: endDate,
        },
      },
    });

    const endingInventoryCost = endingInventory.reduce((total, stock) => {
      return total + stock.purchasePrice * stock.productQuantity;
    }, 0);

    // Calculate total revenue within the specified period
    const totalRevenue = await SalesDetail.sum("revenue", {
      where: {
        "$Sale.soldDate$": {
          [Op.between]: [startDate, endDate],
        },
      },
      include: [
        {
          model: Sales,
          as: "sale",
          attributes: [], 
        },
      ],
      group: ["Sale.salesID"], 
    });

    // Calculate total COGS (Cost of Goods Sold)
    const totalCOGS =
      beginningInventoryCost + purchasesCost - endingInventoryCost;

    // Calculate gross profit
    const grossProfit = totalRevenue - totalCOGS;

    // Update the report
    report.totalRevenue = parseFloat(totalRevenue.toFixed(2));
    report.totalCOGS = parseFloat(totalCOGS.toFixed(2));
    report.grossProfit = parseFloat(grossProfit.toFixed(2));
    report.periodStart = startDate;
    report.periodEnd = endDate;
    await report.save();

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
