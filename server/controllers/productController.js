const { Op, fn, col, where } = require("sequelize");
const Product = require("../models/products");
const Category = require("../models/category");
const Stocks = require("../models/stocks");
const fs = require("fs");
const path = require("path");
const Unit = require("../models/unit");
const generateRandomCode = require("../utils/randomCodeGenerator");

// POST -> localhost:5000/api/v1/product
exports.createProduct = async (req, res) => {
  const {
    productName,
    categoryName,
    productDescription,
    unitType,
    unitPrice,
    reOrderLevel,
    discount,
  } = req.body;

  try {
    const existingProduct = await Product.findOne({
      where: {
        productName: productName,
      },
    });

    if (existingProduct) {
      return res.status(400).json({
        message: `Product with name ${productName} already exists`,
        product: existingProduct,
      });
    }

    const category = await Category.findOne({
      where: { categoryName: categoryName },
    });

    if (!category) {
      return res
        .status(404)
        .json({ error: `Category ${categoryName} not found` });
    }

    const unit = await Unit.findOne({
      where: { unitType: unitType },
    });

    const code = generateRandomCode();

    let discountedPrice = 0;
    if (discount) {
      discountedPrice = unitPrice * ((100 - discount) / 100);
    } else {
      discountedPrice = unitPrice;
    }

    const newProduct = await Product.create({
      productName,
      categoryID: category.categoryID,
      categoryName,
      productDescription,
      unitID: unit.unitID,
      unitType,
      unitPrice,
      discount: discount ? discount : 0,
      discountedPrice,
      reOrderLevel,
      imageUrl: req.file ? req.file.filename : null,
      code: code,
    });

    const io = req.app.get("socketio");

    const count = await Product.count();
    io.emit("productCount", count);

    res.status(201).json({
      message: "Product added successfully",
      result: newProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

// GET -> localhost:5000/api/v1/product/list
exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    const productIDs = products.map((product) => product.productID);

    const stockQuantities = await Stocks.findAll({
      attributes: [
        "productID",
        [fn("sum", col("productQuantity")), "totalQuantity"],
      ],
      where: {
        productID: {
          [Op.in]: productIDs,
        },
      },
      group: ["productID"],
    });

    const stockQuantityMap = stockQuantities.reduce((acc, stock) => {
      acc[stock.productID] = stock.dataValues.totalQuantity;
      return acc;
    }, {});

    const productWithQuantities = products.map((product) => ({
      ...product.dataValues,
      totalQuantity: stockQuantityMap[product.productID] || 0,
    }));

    res.status(200).json(productWithQuantities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving products", error: error.message });
  }
};

// GET -> localhost:5000/api/v1/product/:id
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const stockQuantity = await Stocks.findOne({
      attributes: [[fn("sum", col("productQuantity")), "totalQuantity"]],
      where: {
        productID: id,
      },
      group: ["productID"],
    });

    const totalQuantity = stockQuantity
      ? stockQuantity.dataValues.totalQuantity
      : 0;

    res.status(200).json({
      ...product.dataValues,
      totalQuantity,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving product", error: error.message });
  }
};

// GET -> localhost:5000/api/v1/product/fbc/:categoryID
exports.filterbyCategory = async (req, res) => {
  const { categoryID } = req.params;

  try {
    const products = await Product.findAll({
      where: { categoryID },
    });

    const productIDs = products.map((product) => product.productID);

    const stockQuantities = await Stocks.findAll({
      attributes: [
        "productID",
        [fn("sum", col("productQuantity")), "totalQuantity"],
      ],
      where: {
        productID: {
          [Op.in]: productIDs,
        },
      },
      group: ["productID"],
    });

    const stockQuantityMap = stockQuantities.reduce((acc, stock) => {
      acc[stock.productID] = stock.dataValues.totalQuantity;
      return acc;
    }, {});

    const productWithQuantities = products.map((product) => ({
      ...product.dataValues,
      totalQuantity: stockQuantityMap[product.productID] || 0,
    }));

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found in this category" });
    }

    res.status(200).json(productWithQuantities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT -> localhost:5000/api/v1/product:id
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    categoryName,
    productDescription,
    unitType,
    unitPrice,
    discount,
    reOrderLevel,
  } = req.body;

  console.log(req.file);

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let categoryID = product.categoryID;

    if (categoryName) {
      const category = await Category.findOne({
        where: { categoryName: categoryName },
      });

      if (!category) {
        return res
          .status(404)
          .json({ message: `Category ${categoryName} not found.` });
      }

      categoryID = category.categoryID;
    }

    // Handle image upload if a new file is provided
    if (req.file) {
      console.log("New file uploaded:", req?.file);
    }

    let discountedPrice = 0;
    if (discount) {
      discountedPrice = unitPrice * ((100 - discount) / 100);
    } else {
      discountedPrice = unitPrice;
    }
    // Delete existing image if it exists
    if (product.imageUrl) {
      const filePath = path.join(
        __dirname,
        "../public/products",
        product.imageUrl
      );
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.warn("File does not exist, cannot delete:", filePath);
        } else {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error("Error deleting file:", err);
            } else {
              console.log("File deleted successfully:", filePath);
            }
          });
        }
      });

      // Update product with new image path
      await product.update({
        productName,
        productDescription,
        categoryName,
        unitType: Unit.unitType || unitType,
        unitPrice,
        discount,
        discountedPrice,
        categoryID,
        reOrderLevel,
        imageUrl: req?.file?.filename,
      });
    } else {
      // Update product without changing the image
      await product.update({
        productName,
        productDescription,
        categoryName,
        unitType: Unit.unitType || unitType,
        unitPrice,
        discount,
        discountedPrice,
        reOrderLevel,
        categoryID,
      });
    }

    // Respond with success message
    return res.status(200).json({
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Error updating product" });
  }
};

// DELETE -> localhost:5000/api/v1/product:id
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();

    // Emit event for real-time updates
    const io = req.app.get("socketio");

    // Fetch and emit the updated product count
    const count = await Product.count();
    io.emit("productCount", count);

    res.status(200).json("Product deleted successfully");
  } catch (error) {
    res.status(500).json("Error deleting product");
  }
};

// GET -> localhost:5000/api/v1/product/query
exports.queryProducts = async (req, res) => {
  const { categoryID } = req.query;
  const { page = 1, limit = 8, sort = "ASC", keyword } = req.query;
  try {
    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    if (
      isNaN(parsedPage) ||
      parsedPage < 1 ||
      isNaN(parsedLimit) ||
      parsedLimit < 1
    ) {
      return res.status(400).json({ message: "Invalid parameter" });
    }

    // Sorting by ProductName
    const sortBy = sort.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Search condition

    let searchCondition = {};
    if (categoryID) {
      searchCondition = { ...searchCondition, categoryID };
    }
    if (keyword) {
      searchCondition = {
        ...searchCondition,
        productName: { [Op.like]: `%${keyword}%` },
      };
    }

    const { count, rows: products } = await Product.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [["productName", sortBy]],
    });

    // Get product IDs from the products found
    const productIDs = products.map((product) => product.productID);

    // Find total quantities for the found products
    const stockQuantities = await Stocks.findAll({
      attributes: [
        "productID",
        [fn("sum", col("productQuantity")), "totalQuantity"],
      ],
      where: {
        productID: {
          [Op.in]: productIDs,
        },
      },
      group: ["productID"],
    });

    // Create a map of productID to totalQuantity
    const stockQuantityMap = stockQuantities.reduce((acc, stock) => {
      acc[stock.productID] = stock.dataValues.totalQuantity;
      return acc;
    }, {});

    // Add totalQuantity to each product
    const productWithQuantities = products.map((product) => ({
      ...product.dataValues,
      totalQuantity: stockQuantityMap[product.productID] || 0,
    }));

    res.status(200).json({
      products: productWithQuantities,
      pagination: {
        totalPages: Math.ceil(count / parsedLimit),
        totalCount: count,
        currentPage: parsedPage,
      },
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// GET -> localhost:5000/api/v1/product/count
exports.getProductCount = async (req, res) => {
  try {
    const count = await Product.count();
    res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching product count:", error);
    res
      .status(500)
      .json({ message: "Error fetching product count", error: error.message });
  }
};

// GET -> localhost:5000/api/v1/product-details
exports.fetchProductDetails = async (req, res) => {
  try {
    const stocks = await Stocks.findAll({
      include: {
        model: Product,
        attributes: ["productID", "productName", "unitPrice", "imageUrl"],
      },
      attributes: [
        "stockID",
        "manufacturedDate",
        "expiryDate",
        "productQuantity",
      ],
    });

    const productDetails = stocks.map((stock) => {
      return {
        productID: stock.Product.productID,
        stockID: stock.stockID,
        productName: stock.Product.productName,
        unitPrice: stock.Product.unitPrice,
        image: stock.Product.imageUrl,
        productQuantity: stock.productQuantity,
        manufacturedDate: stock.manufacturedDate,
        expiryDate: stock.expiryDate,
      };
    });

    res.json(productDetails);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
