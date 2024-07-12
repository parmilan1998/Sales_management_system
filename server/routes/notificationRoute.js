const express = require("express");
const router = express.Router();
const {
  getLowStockProducts,
  getOutOfStockProducts,
} = require("../controllers/notificationController");

router.get("/low-stock", getLowStockProducts);
router.get("/out-of-stock", getOutOfStockProducts);

module.exports = router;
