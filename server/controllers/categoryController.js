const db = require("../database/db.js");
const { body,validationResult } = require('express-validator');


// POST - /api/v1/category
exports.createCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const sql = "INSERT INTO category (CategoryName, CDescription) VALUES (?)";
  const values = [req.body.categoryName, req.body.categoryDescription];
  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Error creating category:", err.message);
      return res
        .status(500)
        .json({ message: "Error creating category", error: err.message });
    } else {
      res.status(201).json({
        message: "Category created successfully",
        result,
      });
    }
  });
};

// GET - /api/v1/category/list
exports.getCategories = (req, res) => {
  const sql = "SELECT * FROM category";
  db.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching categories:", err.message);
      res.status(500).send({
        message: "Error fetching categories",
        error: err.message,
      });
    } else {
      res.status(200).send(result);
    }
  });
};

// PUT - /api/v1/category/:id
exports.updateCategory = [
  body('CategoryName').notEmpty().withMessage('CategoryName cannot be empty'),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;

    const sql = "UPDATE category SET `CategoryName`= ?, `CDescription`= ? WHERE CategoryID = ?";
    const values = [req.body.categoryName, req.body.categoryDescription];
    db.query(sql, [...values, id], (err, result) => {
      if (err) {
        console.error("Error updating category:", err.message);
        return res
          .status(500)
          .json({ message: "Error updating category", error: err.message });
      } else {
        res.status(201).json({
          message: "Category updated successfully",
        });
      }
    });
  }
];

// DELETE - /api/v1/category/:id
exports.deleteCategory = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM category WHERE CategoryID = ?";
  db.execute(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting category:", err.message);
      res.status(500).send({
        message: "Error deleting category",
        error: err.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully", result });
  });
};

// GET - /api/v1/category/paginated-list
exports.categoryPagination = (req, res) => {
  const { limit, page } = req.query;
  const offset = limit * (page - 1);

  // Fetch limit and offset
  const limitQuery = `SELECT * FROM category LIMIT ? OFFSET ?`;
  // Fetch Categories count
  const countQuery = `SELECT COUNT(*) as count FROM category`;

  // Total number of categories
  db.query(countQuery, (err, totalPageData) => {
    if (err) {
      return res.status(500).send({
        message: "Error fetching category count",
        error: err.message,
      });
    }

    const totalCount = totalPageData[0].count;
    const totalPage = Math.ceil(totalCount / limit);

    // Pagination for categories
    db.query(limitQuery, [+limit, +offset], (err, data) => {
      if (err) {
        return res.status(500).send({
          message: "Error fetching categories",
          error: err.message,
        });
      }

      res.status(200).send({
        data: data,
        pagination: {
          page: +page,
          limit: +limit,
          totalPage,
        },
      });
    });
  });
};

// GET - /api/v1/category/search
exports.searchCategory = (req, res) => {
  const { CategoryName, CDescription } = req.query;
  
  let query = 'SELECT * FROM category';
  let values = [];
  
  if (CategoryName || CDescription) {
      query += ' WHERE';
      
      if (CategoryName) {
          query += ' CategoryName LIKE ?';
          values.push(`%${CategoryName}%`);
      }
      
      if (CategoryName && CDescription) {
          query += ' AND';
      }
      
      if (CDescription) {
          query += ' CDescription LIKE ?';
          values.push(`%${CDescription}%`);
      }
  }

  db.query(query, values, (err, data) => {
      if (err) {
          console.error('Error executing query:', err.stack);
          return res.status(500).send('Error executing query');
      }
      res.json(data);
  });
};
