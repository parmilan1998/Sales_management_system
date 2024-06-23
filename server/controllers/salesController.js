const { Op } = require("sequelize");
const Sales = require("../models/sales");
const Product = require("../models/products");
const Stocks = require("../models/stocks")

// POST -> localhost:5000/api/v1/sales
exports.createSales = async (req, res) => {
  try {
    const sales = req.body;
    const createdSales = await Promise.all(
      sales.map(async (sale) => {
        const { productName, salesQuantity, custName, customerContact, soldDate } = sale;

        // Find the product in the Product table
        const product = await Product.findOne({
          where: {
            productName: productName,
          },
        });

        if (!product) {
          return res.status(404).json({
            error: `Product '${productName}' not found`,
          });
        }

        const { unitPrice: productUnitPrice } = product;

        // Calculate the total price
        const calculatedTotalPrice = productUnitPrice * salesQuantity;

        // Find stock entries for the product
        const stocks = await Stocks.findAll({
          where: {
            productID: product.productID,
          },
          order: [['purchasedDate', 'ASC']], // Order by purchase date to use older stock first (FIFO)
        });

        let remainingQuantity = salesQuantity;
        for (const stock of stocks) {
          if (remainingQuantity <= 0) break;
          if (stock.productQuantity >= remainingQuantity) {
            stock.productQuantity -= remainingQuantity;
            await stock.save();
            remainingQuantity = 0;
          } else {
            remainingQuantity -= stock.productQuantity;
            stock.productQuantity = 0;
            await stock.save();
          }
        }

        if (remainingQuantity > 0) {
          return res.status(404).json({
            error: `Insufficient quantity available for product '${productName}'`,
          });
        }

        // Create the sale record in the Sales table
        const newSale = await Sales.create({
          productID: product.productID,
          categoryID: product.categoryID,
          productName: productName,
          salesQuantity: salesQuantity,
          unitPrice: productUnitPrice,
          revenue: calculatedTotalPrice,
          custName: custName,
          customerContact: customerContact,
          soldDate: soldDate,
        });

        return newSale;
      })
    );

    res.status(201).json({
      message: "Sales added successfully",
      result: createdSales,
    });
  } catch (e) {
    console.error("Error creating sales:", e);
    res.status(500).json({ message: "Error carrying out sales", e: e.message });
  }
};


// GET -> localhost:5000/api/v1/sales/list
exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sales.findAll();
    res.status(200).json(sales);
  } catch (e) {
    res.status(500).json({ message: "Error retrieving sales" });
  }
};

// PUT -> localhost:5000/api/v1/sales/:id
exports.updateSales = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, salesQuantity, custName, customerContact, soldDate } = req.body;

    const existingSale = await Sales.findByPk(id);

    if (!existingSale) {
      return res.status(404).json({ error: `Sales record with ID '${id}' not found` });
    }

    const currentProduct = await Product.findByPk(existingSale.productID);

    if (!currentProduct) {
      return res.status(404).json({
        error: `Product with ID '${existingSale.productID}' not found`,
      });
    }

    const quantityDifference = salesQuantity - existingSale.salesQuantity;

    // If product name is changing, adjust quantities in old and new products
    if (productName !== existingSale.productName) {
      // Find the new product by name
      const newProduct = await Product.findOne({
        where: {
          productName: productName,
        },
      });

      if (!newProduct) {
        return res.status(404).json({ error: `Product '${productName}' not found` });
      }

      // Find stock entries for the old product
      const oldStocks = await Stocks.findAll({
        where: {
          productID: currentProduct.productID,
        },
        order: [['purchasedDate', 'ASC']], // Order by purchase date to use older stock first (FIFO)
      });

      // Restore quantity in the old product's stock
      let remainingOldQuantity = existingSale.salesQuantity;
      for (const stock of oldStocks) {
        if (remainingOldQuantity <= 0) break;

        const addQuantity = Math.min(remainingOldQuantity, stock.productQuantity);
        stock.productQuantity += addQuantity;
        remainingOldQuantity -= addQuantity;
        await stock.save();
      }

      // Find stock entries for the new product
      const newStocks = await Stocks.findAll({
        where: {
          productID: newProduct.productID,
        },
        order: [['purchasedDate', 'ASC']], // Order by purchase date to use older stock first (FIFO)
      });

      let remainingNewQuantity = salesQuantity;
      for (const stock of newStocks) {
        if (remainingNewQuantity <= 0) break;

        if (stock.productQuantity < remainingNewQuantity) {
          return res.status(404).json({
            error: `Insufficient quantity available for product '${productName}'`,
          });
        }

        const deductQuantity = Math.min(remainingNewQuantity, stock.productQuantity);
        stock.productQuantity -= deductQuantity;
        remainingNewQuantity -= deductQuantity;
        await stock.save();
      }

      // Update the sales record with new product details
      existingSale.productID = newProduct.productID;
      existingSale.categoryID = newProduct.categoryID;
      existingSale.productName = newProduct.productName;
    } else {
      // Adjust quantity in the same product's stock
      const stocks = await Stocks.findAll({
        where: {
          productID: currentProduct.productID,
        },
        order: [['purchasedDate', 'ASC']], // Order by purchase date to use older stock first (FIFO)
      });

      if (quantityDifference !== 0) {
        let remainingQuantity = Math.abs(quantityDifference);

        for (const stock of stocks) {
          if (remainingQuantity <= 0) break;

          if (quantityDifference > 0) {
            // Decrease product quantity if salesQuantity is increased
            const deductQuantity = Math.min(remainingQuantity, stock.productQuantity);
            stock.productQuantity -= deductQuantity;
            remainingQuantity -= deductQuantity;
          } else {
            // Increase product quantity if salesQuantity is decreased
            stock.productQuantity += remainingQuantity;
            remainingQuantity = 0;
          }
          await stock.save();
        }

        if (quantityDifference > 0 && remainingQuantity > 0) {
          return res.status(404).json({
            error: `Insufficient quantity available for product '${productName}'`,
          });
        }
      }
    }

    // Update sales record details
    existingSale.salesQuantity = salesQuantity;
    existingSale.custName = custName;
    existingSale.customerContact = customerContact;
    existingSale.soldDate = soldDate;

    // Calculate the new total price
    const { unitPrice: productUnitPrice } = currentProduct;
    const calculatedTotalPrice = productUnitPrice * salesQuantity;
    existingSale.revenue = calculatedTotalPrice;

    // Save the updated sales record
    await existingSale.save();

    res.status(200).json({
      message: `Sales record with ID '${id}' updated successfully`,
      updatedSale: existingSale,
    });
  } catch (e) {
    console.error("Error updating sales:", e);
    res.status(500).json({ message: "Error updating sales", e: e.message });
  }
};


// DELETE -> localhost:5000/api/v1/sales/:id
exports.deleteSales = async (req, res) => {
  const { id } = req.params;

  try {
    const sale = await Sales.findByPk(id);
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    const salesDelete = await sale.destroy();
    res.status(200).json({
      message: `Sales deleted successfully`,
      deletedSale: salesDelete,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

// GET -> localhost:5000/api/v1/sales/query
exports.querySales = async (req, res) => {
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
