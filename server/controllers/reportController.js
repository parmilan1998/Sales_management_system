const { Op } = require("sequelize");
const Reports = require("../models/reports");
const Sales = require("../models/sales");
const Purchase = require("../models/purchase");
const Stocks = require("../models/stocks");
const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer");
const exphbs = require("express-handlebars");

// Create an instance of express-handlebars with custom configurations
const hbs = exphbs.create({
  layoutsDir: path.join(__dirname, "public/views/layouts"),
  defaultLayout: "index",
});

// Function to render the Handlebars template with dynamic data
const renderTemplate = async (data) => {
  const templatePath = path.join(__dirname, "../public/views/main.handlebars");
  const template = fs.readFileSync(templatePath, "utf8");
  const compiledTemplate = hbs.handlebars.compile(template); // Use existing hbs instance
  return compiledTemplate(data);
};

// Generate PDF from HTML content
const generatePDFReport = async (htmlContent, reportID) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const cssPath = path.resolve(__dirname, '../public/index.css');
  await page.setContent(htmlContent);
  await page.addStyleTag({ path: cssPath });

  const pdfFileName = `Gross_Profit_Report_${reportID}.pdf`;
  const pdfFilePath = path.resolve(__dirname, "../public/reports", pdfFileName);

  await page.pdf({ path: pdfFilePath, format: "A4" });
  await browser.close();

  console.log(`PDF Report saved: ${pdfFilePath}`);
  return pdfFileName;
};

// POST -> localhost:5000/api/v1/reports
exports.createReport = async (req, res) => {
  try {
    const { startDate, endDate, reportName } = req.body;

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
    const totalRevenue = await Sales.sum("totalRevenue", {
      where: {
        soldDate: {
          [Op.between]: [start, end],
        },
      },
    });

    // Calculate total COGS (Cost of Goods Sold)
    const totalCOGS =
      beginningInventoryCost + purchasesCost - endingInventoryCost;

    // Calculate gross profit
    const grossProfit = totalRevenue - totalCOGS;

    // Count total number of sales
    const totalSales = await Sales.count({
      where: {
        soldDate: {
          [Op.between]: [start, end],
        },
      },
    });

    const totalPurchases = await Purchase.count({
      where: {
        purchasedDate: {
          [Op.between]: [start, end],
        },
      },
    });

    const totalRevenueFinal = totalRevenue
      ? parseFloat(totalRevenue.toFixed(2))
      : 0;
    const totalCOGSFinal = totalCOGS ? parseFloat(totalCOGS.toFixed(2)) : 0;
    const grossProfitFinal = grossProfit
      ? parseFloat(grossProfit.toFixed(2))
      : 0;

    // Create a new report
    const newReport = await Reports.create({
      reportName: reportName,
      totalRevenue: totalRevenueFinal,
      totalCOGS: totalCOGSFinal,
      grossProfit: grossProfitFinal,
      startDate: startDate,
      endDate: endDate,
    });

    // Prepare data for the template
    const templateData = {
      reportName,
      startDate: startDate,
      endDate: endDate,
      totalPurchases,
      totalCOGS: totalCOGSFinal,
      totalSales,
      totalRevenue: totalRevenueFinal,
      grossProfit: grossProfitFinal,
    };

    // Render the HTML content
    const htmlContent = await renderTemplate(templateData);

    // Generate PDF report
    const reportFileName = await generatePDFReport(
      htmlContent,
      newReport.reportID
    );

    newReport.reportFile = reportFileName;
    await newReport.save();

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

// GET -> localhost:5000/api/v1/reports/query
exports.queryReport = async (req, res) => {
  try {
    // Query parameters
    const { page = 1, limit = 8, sort = "ASC", keyword } = req.query;

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    // Search condition
    const searchCondition = keyword
      ? { reportName: { [Op.like]: `%${keyword}%` } }
      : {};

    // Sorting by ASC or DESC
    const sortOrder = sort === "DESC" ? "DESC" : "ASC";

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

const reportsDirectory = path.resolve(__dirname, "../public/reports");
// Ensure the directory exists
if (!fs.existsSync(reportsDirectory)) {
  fs.mkdirSync(reportsDirectory, { recursive: true });
}

exports.getReport = async (req, res) => {
  const { id } = req.params;
  const filePath = path.join(reportsDirectory, `Gross_Profit_Report_${id}.pdf`);

  try {
    if (fs.existsSync(filePath)) {
      res.download(filePath);
    } else {
      res.status(404).json({ message: "Report not found" });
    }
  } catch (error) {
    console.error("Error fetching report:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch report", error: error.message });
  }
};
