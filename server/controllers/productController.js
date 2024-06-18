const { Op } = require("sequelize");
const Product = require("../models/products");
const Category = require("../models/category");

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
      unitPrice,
      manufacturedDate,
      expiryDate 
    } = product;

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
        categoryName: category.categoryName,
        productDescription,
        unitPrice,
        manufacturedDate,
        expiryDate 
       });

        return newProduct;
      })
    );

    res.status(201).json({
      message: "Product added successfully",
      result: createdProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error: error.message });
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
  const { productName,
    categoryName,
    productDescription,
    unitPrice,
    manufacturedDate,
    expiryDate  } =
    req.body;

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

// GET -> localhost:5000/api/v1/product/search
exports.searchProduct = async (req, res) => {
  const { productName, categoryName } = req.query;

  try {
    let whereCondition = {};

    if (productName) {
      whereCondition.productName = {
        [Op.like]: `%${productName}%`,
      };
    }

    let include = [];

    if (categoryName) {
      include.push({
        model: Category,
        where: {
          categoryName: {
            [Op.like]: `%${categoryName}%`,
          },
        },
      });
    }

    const product = await Product.findOne({
      where: whereCondition,
      include: include,
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" }); }
  } catch (error) {
    res.status(500).send("Error searching products");
  }
};

// GET -> localhost:5000/api/v1/product/pagination-list
exports.paginationProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: "Invalid page or limit parameters" });
    }

    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      offset: offset,
      limit: limit,
      include: [{
        model: Category,
        as: 'category',
        attributes: ['categoryName']
      }]
    });

    res.status(200).json({
      products: products.rows,
      totalPages: Math.ceil(products.count / limit),
      totalCount: products.count,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).send("Error deleting product");
  }
};

// GET -> localhost:5000/api/v1/product/sorting-data
exports.sortingProduct = async (req, res) => {
  const sortOrder = req.query.sort === "desc" ? "DESC" : "ASC";
  const sorting = await Product.findAll({
    order: [["productName", sortOrder]],
  });

  res.status(200).json(sorting);
  try {
  } catch (error) {
    res.status(500).send("Error deleting product");
  }
};

