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

// GET -> localhost:5000/api/v1/category/paginated-list
exports.categoryPagination = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: "Invalid page or limit parameters" });
    }

    const offset = (page - 1) * limit;

    const categories = await Category.findAndCountAll({
      offset: offset,
      limit: limit,
    });
    res.status(200).json({
      categories: categories.rows,
      totalPages: Math.ceil(categories.count / limit),
      totalCount: categories.count,
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET -> localhost:5000/api/v1/category/search
exports.searchCategory = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: "Search keyword is required" });
    }
    const searchOutputs = await Category.findAll({
      where: {
        [Op.or]: [
          {
            categoryName: {
              [Op.like]: `%${keyword}%`,
            },
          },
          {
            categoryDescription: {
              [Op.like]: `%${keyword}%`,
            },
          },
        ],
      },
    });
    res.status(200).json({
      searchOutputs: searchOutputs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
