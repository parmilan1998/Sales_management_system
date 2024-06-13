import db from "../database/db.js";

// POST - /api/v1/category
export const createCategory = (req, res) => {
  const { categoryName, categoryDescription } = req.body;

  if (!categoryName || !categoryDescription) {
    return res
      .status(400)
      .json({ message: "Category name and description are required" });
  }
  const sql =
    "INSERT INTO category (categoryName, categoryDescription) VALUES (?)";
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
export const getCategories = (req, res) => {
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
export const updateCategory = (req, res) => {
  const { id } = req.params;

  const sql =
    "UPDATE category SET `categoryName`= ?, `categoryDescription`= ? WHERE categoryID = ?";
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
};

// DELETE - /api/v1/category/:id
export const deleteCategory = (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM category WHERE categoryID = ?";
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
export const categoryPagination = (req, res) => {
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
