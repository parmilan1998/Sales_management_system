const express = require("express");
const router = express.Router();
const {
  createStocks,
  queryStocks,
  getAllStocks,
  updateStocks,
  deleteStocks,
} = require("../controllers/stockController");

router.post("/", createStocks);
router.get("/query", queryStocks);
router.get("/all", getAllStocks);
router.put("/:id", updateStocks);
router.delete("/:id", deleteStocks);

module.exports = router;
