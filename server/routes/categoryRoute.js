const express = require("express");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

router.post("/", categoryController.createCategory);
router.get("/query", categoryController.queryCategory);
router.get("/list", categoryController.getCategories);
router.put("/:id", categoryController.updateCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
