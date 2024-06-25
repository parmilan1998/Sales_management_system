const Category = require("../models/category");
const { Op } = require("sequelize");

// POST -> localhost:5000/api/v1/category
exports.createCategory = async (req, res) => {
  try {
    const { categoryName, categoryDescription } = req.body;
    console.log(req.body);
    if (!categoryName) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const category = await Category.create({
      categoryName,
      categoryDescription,
    });
    res.status(201).json({
      message: "Category Created Successfully!",
      category: category,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET -> localhost:5000/api/v1/category/list
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      categories: categories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT -> localhost:5000/api/v1/category/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, categoryDescription } = req.body;
    const category = await Category.findByPk(id);
    // Check category exists or not
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    // Update category
    const categoryUpdate = await category.update(req.body);
    res.status(200).json({
      message: "Category Updated Successfully!",
      updateCategory: categoryUpdate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE -> localhost:5000/api/v1/category/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    // Check category exists or not
    if (!category) {
      res.status(404).json({ message: "Category not found" });
    }
    // Delete category
    const deletedCategory = await category.destroy();
    res.status(200).json({
      message: "Category deleted successfully",
      deletedCategory: deletedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET -> localhost:5000/api/v1/category/query
exports.queryCategory = async (req, res) => {
  try {
    // Query parameters
    const { keyword, page = 1, limit = 6, sort = "ASC" } = req.query;

    // Pagination
    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const offset = (parsedPage - 1) * parsedLimit;

    // Search condition
    const searchCondition = keyword
      ? { categoryName: { [Op.like]: `%${keyword}%` } }
      : {};

    // Sorting by ASC or DESC
    const sortOrder = sort === "desc" ? "DESC" : "ASC";

    // search, pagination, and sorting
    const { count, rows: categories } = await Category.findAndCountAll({
      where: searchCondition,
      offset: offset,
      limit: parsedLimit,
      order: [["createdAt", sortOrder]],
    });

    // Total pages
    const totalPages = Math.ceil(count / parsedLimit);

    res.status(200).json({
      categories,
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
