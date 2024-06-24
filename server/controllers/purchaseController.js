const Purchase = require("../models/purchase");
const { Op } = require("sequelize");
const Product = require("../models/products");
const Stocks = require("../models/stocks");

// POST -> localhost:5000/api/v1/purchase
exports.createPurchase = async (req, res) => {
  try {
    const purchases = req.body;
    const purchasedGoods = await Promise.all(
      purchases.map(async (purchase) => {
        const {
          productName,
          purchaseVendor,
          vendorContact,
          purchaseQuantity,
          purchasePrice,
          manufacturedDate,
          expiryDate,
          purchasedDate,
        } = purchase;

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
        const totalCost = purchasePrice * purchaseQuantity;

        const createdPurchase = await Purchase.create({
          productID: product.productID,
          productName,
          purchaseVendor,
          vendorContact,
          purchaseQuantity,
          purchasePrice,
          COGP: totalCost,
          purchasedDate,
        });

        const existingStock = await Stocks.findOne({
          where: {
            productID: product.productID,
            purchasePrice: purchasePrice,
            manufacturedDate: manufacturedDate,
            expiryDate: expiryDate,
            purchasedDate: purchasedDate,
          },
        });

        if (existingStock) {
          // Update product quantity for the existing product
          existingStock.productQuantity += purchaseQuantity;
          await existingStock.save();
        } else {
          await Stocks.create({
            productName,
            productID: product.productID,
            purchaseID: createdPurchase.purchaseID,
            productQuantity: purchaseQuantity,
            manufacturedDate: manufacturedDate,
            expiryDate: expiryDate,
            purchasePrice: purchasePrice,
            purchasedDate: purchasedDate,
          });
        }
      })
    );

    res.status(201).json({
      message: "Purchase Created Successfully!",
      purchase: createdPurchase,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET -> localhost:5000/api/v1/purchase
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll();
    res.status(200).json({
      message: "Fetch all purchases successfully",
      count: purchases.length,
      purchase: purchases,
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving purchases" });
  }
};

// PUT -> localhost:5000/api/v1/purchase
exports.updatePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      productName,
      purchaseQuantity,
      purchasePrice,
      purchaseVendor,
      vendorContact,
      purchasedDate,
      manufacturedDate,
      expiryDate,
    } = req.body;

    // Find the existing purchase record
    const existingPurchase = await Purchase.findByPk(id);

    if (!existingPurchase) {
      return res
        .status(404)
        .json({ error: `Purchase record with ID '${id}' not found` });
    }

    // Find the stock entry for the old product associated with the existing purchase record
    const oldStock = await Stocks.findOne({
      where: {
        productID: existingPurchase.productID,
        purchaseID: existingPurchase.purchaseID,
      },
    });

    if (!oldStock) {
      return res.status(404).json({
        error: `Original stock entry for purchase ID '${existingPurchase.purchaseID}' not found`,
      });
    }

    // Find the new product based on the provided productName
    const newProduct = await Product.findOne({
      where: {
        productName: productName,
      },
    });

    if (!newProduct) {
      return res
        .status(404)
        .json({ error: `Product '${productName}' not found` });
    }

    // Find or create the stock entry for the new product
    let newStock = await Stocks.findOne({
      where: {
        productID: newProduct.productID,
        purchasePrice: purchasePrice,
        manufacturedDate: manufacturedDate,
        expiryDate: expiryDate,
        purchasedDate: purchasedDate,
      },
    });

    if (!newStock) {
      newStock = await Stocks.create({
        productID: newProduct.productID,
        productName: newProduct.productName,
        purchaseID: existingPurchase.purchaseID,
        productQuantity: 0,
        purchasePrice: purchasePrice,
        manufacturedDate: manufacturedDate,
        expiryDate: expiryDate,
        purchasedDate: purchasedDate,
      });
    }

    const quantityDifference =
      purchaseQuantity - existingPurchase.purchaseQuantity;

    // Adjust quantities based on whether the product name is changing
    if (newProduct.productID !== existingPurchase.productID) {
      // Reduce quantity in the old stock entry
      oldStock.productQuantity -= existingPurchase.purchaseQuantity;
      await oldStock.save();

      // Increase quantity in the new stock entry
      newStock.productQuantity += purchaseQuantity;
      await newStock.save();
    } else {
      // If product name is not changing, just update the quantity difference
      if (quantityDifference !== 0) {
        newStock.productQuantity += quantityDifference;
        await newStock.save();
      }
    }

    // Update the existing purchase record
    existingPurchase.productID = newProduct.productID;
    existingPurchase.productName = productName;
    if (purchaseQuantity !== undefined)
      existingPurchase.purchaseQuantity = purchaseQuantity;
    if (purchasePrice !== undefined) {
      existingPurchase.purchasePrice = purchasePrice;
      existingPurchase.COGP =
        purchasePrice * (purchaseQuantity || existingPurchase.purchaseQuantity);
    }
    if (purchaseVendor) existingPurchase.purchaseVendor = purchaseVendor;
    if (vendorContact) existingPurchase.vendorContact = vendorContact;
    existingPurchase.purchasedDate = purchasedDate;

    // Save the updated purchase record
    await existingPurchase.save();

    res.status(200).json({
      message: `Purchase record with ID '${id}' updated successfully`,
      updatedPurchase: existingPurchase,
    });
  } catch (e) {
    console.error("Error updating purchase:", e);
    res.status(500).json({ message: "Error updating purchase", e: e.message });
  }
};

// DELETE -> localhost:5000/api/v1/purchase
exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }
    const destroyPurchase = await purchase.destroy();
    res.status(200).json({
      message: "Purchase deleted successfully",
      deletePurchase: destroyPurchase,
    });
  } catch (error) {
    console.error("Error deleting purchase:", error);
    res.status(500).send("Error deleting purchase");
  }
};

// GET -> localhost:5000/api/v1/purchase/query
exports.queryPurchase = async (req, res) => {
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
