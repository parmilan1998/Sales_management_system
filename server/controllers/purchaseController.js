const Purchase = require("../models/purchase");
const { Op, fn, col } = require("sequelize");
const Product = require("../models/products");
const Stocks = require("../models/stocks");

// POST -> localhost:5000/api/v1/purchase
exports.createPurchase = async (req, res) => {
  try {
    const {
      productName,
      purchaseVendor,
      vendorContact,
      purchaseQuantity,
      purchasePrice,
      manufacturedDate,
      expiryDate,
      purchasedDate,
    } = req.body;

    const product = await Product.findOne({
      where: {
        productName: productName,
      },
    });

    if (!product) {
      return res.status(404).json({
        message: `Product '${productName}' not found`,
      });
    }

    if (purchasedDate < manufacturedDate) {
      return res.status(404).json({
        message: `Check the purchasedDate`,
      });
    }

    if (manufacturedDate > expiryDate) {
      return res.status(404).json({
        message: `Check the manufacturedDate`,
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

      if (existingStock.relatedPurchaseIDs) {
        existingStock.relatedPurchaseIDs += `,${createdPurchase.purchaseID}`;
      } else {
        existingStock.relatedPurchaseIDs = `${createdPurchase.purchaseID}`;
      }
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
        relatedPurchaseIDs: `${createdPurchase.purchaseID}`,
      });
    }

    res.status(201).json({
      message: "Purchase Created Successfully!",
      purchase: createdPurchase,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET -> localhost:5000/api/v1/purchase/list
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

// GET -> localhost:5000/api/v1/purchase/:id
exports.getPurchaseById = async (req, res) => {
  const { id } = req.params;

  try {
    const purchase = await Purchase.findByPk(id);

    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    const stocks = await Stocks.findOne({
      attributes: ["manufacturedDate", "expiryDate"],
      where: {
        purchaseID: id,
      },
    });

    res.status(200).json({
      ...purchase.dataValues,
      manufacturedDate: stocks.manufacturedDate,
      expiryDate: stocks.expiryDate,
    });
  } catch (error) {
    console.error("Error fetching purchase:", error);
    res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
};

// PUT -> localhost:5000/api/v1/purchase/:id
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
        relatedPurchaseIDs: {
          [Op.substring]: `${existingPurchase.purchaseID}`,
        },
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
        purchasePrice: purchasePrice || oldStock.purchasePrice,
        manufacturedDate: manufacturedDate || oldStock.manufacturedDate,
        expiryDate: expiryDate || oldStock.expiryDate,
        purchasedDate: purchasedDate || oldStock.purchasedDate,
      },
    });

    if (!newStock) {
      newStock = await Stocks.create({
        productID: newProduct.productID,
        productName: newProduct.productName,
        purchaseID: existingPurchase.purchaseID,
        productQuantity: 0,
        purchasePrice: purchasePrice || oldStock.purchasePrice,
        manufacturedDate: manufacturedDate || oldStock.manufacturedDate,
        expiryDate: expiryDate || oldStock.expiryDate,
        purchasedDate: purchasedDate || oldStock.purchasedDate,
        relatedPurchaseIDs: `${existingPurchase.purchaseID}`,
      });
    }

    const quantityDifference =
      (purchaseQuantity !== undefined
        ? purchaseQuantity
        : existingPurchase.purchaseQuantity) -
      existingPurchase.purchaseQuantity;

    // Adjust quantities and update purchase IDs based on whether the product name is changing
    if (newProduct.productID !== existingPurchase.productID) {
      // Reduce quantity in the old stock entry
      oldStock.productQuantity -= existingPurchase.purchaseQuantity;

      // Remove the existing purchase ID from relatedPurchaseIDs
      const updatedRelatedPurchaseIDs = oldStock.relatedPurchaseIDs
        .split(",")
        .filter((id) => id !== `${existingPurchase.purchaseID}`)
        .join(",");

      oldStock.relatedPurchaseIDs = updatedRelatedPurchaseIDs;
      await oldStock.save();

      // Increase quantity in the new stock entry
      newStock.productQuantity +=
        purchaseQuantity !== undefined
          ? purchaseQuantity
          : existingPurchase.purchaseQuantity;

      // Add the existing purchase ID to the new stock's relatedPurchaseIDs
      if (newStock.relatedPurchaseIDs) {
        newStock.relatedPurchaseIDs += `,${existingPurchase.purchaseID}`;
      } else {
        newStock.relatedPurchaseIDs = `${existingPurchase.purchaseID}`;
      }
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
    if (purchaseVendor !== undefined)
      existingPurchase.purchaseVendor = purchaseVendor;
    if (vendorContact !== undefined)
      existingPurchase.vendorContact = vendorContact;
    if (purchasedDate !== undefined)
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

// DELETE -> localhost:5000/api/v1/purchase/:id
exports.deletePurchase = async (req, res) => {
  try {
    const { id } = req.params;
    const purchase = await Purchase.findByPk(id);
    if (!purchase) {
      return res.status(404).json({ message: "Purchase not found" });
    }

    // Remove related purchaseID from purchaseID in Stocks table
    const stockEntries = await Stocks.findAll({
      where: {
        relatedPurchaseIDs: {
          [Op.like]: `%${id}%`,
        },
      },
    });

    for (const stock of stockEntries) {
      if (purchase.purchaseID == stock.purchaseID) {
        stock.purchaseID = null;
      }

      await stock.save();

      const destroyPurchase = await purchase.destroy();

      res.status(200).json({
        message: "Purchase deleted successfully",
        deletePurchase: destroyPurchase,
      });
    }
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

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    // Search condition
    const searchCondition = keyword
      ? {
          [Op.or]: [
            { productName: { [Op.like]: `%${keyword}%` } },
            { purchasedDate: { [Op.eq]: keyword } },
          ],
        }
      : {};

    // Sorting by ASC or DESC
    const sortOrder = sort === "DESC" ? "DESC" : "ASC";

    // search, pagination, and sorting
    const { count, rows: purchases } = await Purchase.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [["productName", sortOrder]],
      include: [
        {
          model: Stocks,
          attributes: ["manufacturedDate", "expiryDate"],
        },
      ],
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
