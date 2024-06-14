const express = require("express");
const router = express.Router();
const {
  createProduct,
  searchProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  paginationProduct,
  sortingProduct,
} = require("../controllers/productController");

router.post("/", createProduct);
router.get("/search", searchProduct);
router.get("/pagination-list", paginationProduct);
router.get("/sorting-data", sortingProduct);
router.get("/all", getAllProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProduct);

module.exports = router;
