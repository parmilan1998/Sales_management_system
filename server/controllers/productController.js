const { Op, fn, col } = require("sequelize");
const Product = require("../models/products");
const Category = require("../models/category");
const Stocks = require("../models/stocks");

// POST -> localhost:5000/api/v1/product
exports.createProduct = async (req, res) => {
  const { productName, categoryName, productDescription, unitPrice } = req.body;

  try {
    // Check if the product already exists
    const existingProduct = await Product.findOne({
      where: { productName: productName },
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

    const newProduct = await Product.create({
      productName,
      categoryID: category.categoryID,
      categoryName,
      productDescription,
      unitPrice,
      imageUrl: req.file ? req.file.path : null,
    });

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

// PUT -> localhost:5000/api/v1/product:id
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productName, categoryName, productDescription, unitPrice } = req.body;

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
      console.log("New file uploaded:", req.file);

      // Delete existing image if it exists
      if (product.imageUrl) {
        fs.unlink(product.imageUrl, (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          }
        });
      }

      // Update product with new image path
      await product.update({
        productName,
        productDescription,
        categoryName,
        unitPrice,
        categoryID,
        imageUrl: req.file.path, // Update imageUrl with the new file path
      });
    } else {
      // Update product without changing the image
      await product.update({
        productName,
        productDescription,
        categoryName,
        unitPrice,
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
    res.status(200).json("Product deleted successfully");
  } catch (error) {
    res.status(500).json("Error deleting product");
  }
};

// GET -> localhost:5000/api/v1/product/query
exports.queryProducts = async (req, res) => {
  try {
    const { page = 1, limit = 8, sort = "ASC", keyword } = req.query;

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
    const searchCondition = keyword
      ? { productName: { [Op.like]: `%${keyword}%` } }
      : {};

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
