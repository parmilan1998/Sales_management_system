const Category = require("../models/category");
const { body, validationResult } = require('express-validator');

// POST - /api/v1/category
exports.createCategory = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { categoryName, categoryDescription } = req.body;

  try {
    const newCategory = await Category.create({
      CategoryName: categoryName,
      CDescription: categoryDescription
    });

    res.status(201).json({
      message: "Category created successfully",
      result: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ message: "Error creating category", error: error.message });
  }
};

// GET - /api/v1/category/list
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// PUT - /api/v1/category/:id
exports.updateCategory = [
  body('categoryName').notEmpty().withMessage('CategoryName cannot be empty'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { categoryName, categoryDescription } = req.body;

    try {
      const category = await Category.findByPk(id);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      await category.update({
        CategoryName: categoryName,
        CDescription: categoryDescription
      });

      res.status(200).json({
        message: "Category updated successfully",
        result: category,
      });
    } catch (error) {
      console.error("Error updating category:", error.message);
      res.status(500).json({ message: "Error updating category", error: error.message });
    }
  }
];

// DELETE - /api/v1/category/:id
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  
  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error.message);
    res.status(500).json({ message: "Error deleting category", error: error.message });
  }
};

// GET - /api/v1/category/paginated-list
exports.categoryPagination = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const offset = limit * (page - 1);

  try {
    const totalCount = await Category.count();
    const totalPages = Math.ceil(totalCount / limit);

    const categories = await Category.findAll({
      limit: +limit,
      offset: +offset
    });

    res.status(200).json({
      data: categories,
      pagination: {
        page: +page,
        limit: +limit,
        totalPage: totalPages
      }
    });
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res.status(500).json({ message: "Error fetching categories", error: error.message });
  }
};

// GET - /api/v1/category/search
exports.searchCategory = async (req, res) => {
  const { CategoryName, CDescription } = req.query;
  const whereClause = {};

  if (CategoryName) {
    whereClause.CategoryName = { [Sequelize.Op.like]: `%${CategoryName}%` };
  }
  if (CDescription) {
    whereClause.CDescription = { [Sequelize.Op.like]: `%${CDescription}%` };
  }

  try {
    const categories = await Category.findAll({ where: whereClause });
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error searching categories:", error.message);
    res.status(500).json({ message: "Error searching categories", error: error.message });
  }
};
