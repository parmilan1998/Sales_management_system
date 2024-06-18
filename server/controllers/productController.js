const { Op, where } = require("sequelize");
const { Product } = require("../models/products");
const Category = require("../models/category");
const Purchase = require("../models/purchase");

// POST -> localhost:5000/api/v1/product
exports.createProduct = async (req, res) => {
  const products = req.body;
  try {
    const createdProduct = await Promise.all(
      products.map(async (product) => {
        const {
          productName,
          categoryName,
          productDescription,
          productQuantity,
          manufacturedDate,
          expiryDate,
        } = product;

        const category = await Category.findOne({
          where: { categoryName: categoryName },
        });

        if (!category) {
          return res
            .status(404)
            .json({ error: `Category ${categoryName} not found` });
        }
        const purchase = await Purchase.findOne({
          where: { productName: productName },
        });

        if (!purchase) {
          return res
            .status(404)
            .json({ error: `Purchase price for ${productName} not found` });
        }

        const unitPrice = purchase.purchasePrice * 1.1;

        const newProduct = await Product.create({
          productName,
          categoryID: category.categoryID,
          categoryName: category.categoryName,
          productDescription,
          productQuantity,
          unitPrice,
          manufacturedDate,
          expiryDate,
        });

        return newProduct;
      })
    );

    res.status(201).json({
      message: "Product added successfully",
      result: createdProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

exports.getAllProduct = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).send("Error retrieving products");
  }
};

// GET -> localhost:5000/api/v1/product:id
exports.getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).send("Error retrieving product");
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    productName,
    categoryName,
    productDescription,
    unitPrice,
    manufacturedDate,
    expiryDate,
  } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let category;
    if (categoryName) {
      category = await Category.findOne({
        where: { categoryName: categoryName },
      });

      if (!category) {
        return res
          .status(404)
          .json({ message: `Category ${categoryName} not found.` });
      }
    }

    await product.update({
      productName,
      categoryName,
      productDescription,
      unitPrice,
      manufacturedDate,
      expiryDate,
      categoryID: category ? category.categoryID : null,
    });

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
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
    res.status(200).send("Product deleted successfully");
  } catch (error) {
    res.status(500).send("Error deleting product");
  }
};

exports.queryProducts = async (req, res) => {
  try {
    const { page, limit, sort = "ASC", keyword } = req.query;
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);

    if (
      isNaN(parsedPage) ||
      parsedPage < 1 ||
      isNaN(parsedLimit) ||
      parsedLimit < 1
    ) {
      return res.status(400).json({ message: "Invalid parameter" });
    }

    // Calculate offset
    const offset = (parsedPage - 1) * parsedLimit;

    // Set sort order
    const sortBy = sort.toLowerCase() === "desc" ? "DESC" : "ASC";

    // Search condition
    const searchCondition = keyword
      ? { productName: { [Op.like]: `%${keyword}%` } }
      : {};

    // Fetch products with pagination and sorting
    const { count, rows: products } = await Product.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [["productName", sortBy]],
    });

    // Respond with products and pagination info
    res.status(200).json({
      products: products,
      pagination: {
        totalPages: Math.ceil(count / parsedLimit),
        totalCount: count,
        currentPage: parsedPage,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).send({ message: error.message });
  }
};
