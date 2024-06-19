const Purchase = require("../models/purchase");
const { Op } = require("sequelize");
const Product = require("../models/products");

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
        const calculatedTotalPrice = purchasePrice * purchaseQuantity;
        const newPurchase = await Purchase.create({
          productID: product.productID,
          productName,
          purchaseVendor,
          vendorContact,
          purchaseQuantity,
          purchasePrice,
          COGP: calculatedTotalPrice,
        });
        product.productQuantity += purchaseQuantity;
        await product.save();
        return newPurchase;
      })
    );

    res.status(201).json({
      message: "Purchase Created Successfully!",
      result: purchasedGoods,
    });
  } catch (err) {
    console.error("Error creating purchase:", err);
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
    } = req.body;

    // Find the existing purchase record
    const existingPurchase = await Purchase.findByPk(id);

    if (!existingPurchase) {
      return res
        .status(404)
        .json({ error: `Purchase record with ID '${id}' not found` });
    }

    // Find the old product associated with the existing purchase record
    const oldProduct = await Product.findOne({
      where: {
        productID: existingPurchase.productID,
      },
    });

    if (!oldProduct) {
      return res.status(404).json({
        error: `Original product with ID '${existingPurchase.productID}' not found`,
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

    const quantityDifference =
      purchaseQuantity - existingPurchase.purchaseQuantity;

    if (newProduct.productID !== existingPurchase.productID) {
      oldProduct.productQuantity -= existingPurchase.purchaseQuantity; // Restore old product quantity
      await oldProduct.save();

      newProduct.productQuantity += purchaseQuantity; // Deduct new product quantity
      await newProduct.save();
    } else {
      // Product name is not changing, adjust quantity based on purchaseQuantity change
      if (quantityDifference !== 0) {
        if (quantityDifference > 0) {
          // Increase product quantity if purchaseQuantity is increased
          newProduct.productQuantity += quantityDifference;
        } else {
          // Decrease product quantity if purchaseQuantity is decreased
          newProduct.productQuantity -= Math.abs(quantityDifference);
        }
        await newProduct.save();
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
