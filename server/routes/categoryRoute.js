const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.post("/", categoryController.createCategory);
router.get("/list", categoryController.getCategories);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);
router.get("/paginated-list", categoryController.categoryPagination);
router.get("/search", categoryController.searchCategory);

module.exports = router;
