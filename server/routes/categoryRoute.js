import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  categoryPagination,
  searchCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.post("/", createCategory);
router.get("/list", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);
router.get("/paginated-list", categoryPagination);
router.get('/search', searchCategory);

export default router;
