const express = require("express");
const router = express.Router();
const {
  getLowStockProducts
} = require("../controllers/notificationController");

router.get("/low-stock", getLowStockProducts);

module.exports = router;
