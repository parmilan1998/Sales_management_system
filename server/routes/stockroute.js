const express = require("express");
const router = express.Router();
const {
  createStocks,
  queryStocks,
  getAllStocks,
  updateStocks,
  deleteStocks,
  getTotalProductQuantity,
} = require("../controllers/stockController");

router.post("/", createStocks);
router.get("/query", queryStocks);
router.get("/all", getAllStocks);
router.get("/total", getTotalProductQuantity)
router.put("/:id", updateStocks);
router.delete("/:id", deleteStocks);

module.exports = router;
