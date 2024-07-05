const express = require("express");
const router = express.Router();
const {
  createSales,
  getAllSales,
  updateSales,
  deleteSales,
  querySales,
  deleteSalesDetail,
  getSalesById,
} = require("../controllers/salesController");

router.post("/", createSales);
router.get("/list", getAllSales);
router.put("/:id", updateSales);
router.get("/:id", getSalesById);
router.get("/query", querySales);
router.delete("/:id", deleteSales);
router.delete("/details/:id", deleteSalesDetail);

module.exports = router;
