const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  queryProducts,
} = require("../controllers/productController");

router.post("/", createProduct);
router.get("/query", queryProducts);
router.get("/list", getAllProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProduct);

module.exports = router;
