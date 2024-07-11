const express = require("express");
const router = express.Router();
const {
  createSales,
  getAllSales,
  updateSales,
  // deleteSales,
  querySales,
  salesSort,
  // deleteSalesDetail,
  getSalesById,
  returnProductFromSale
} = require("../controllers/salesController");

router.post("/", createSales);
router.get("/list", getAllSales);
router.put("/return/:salesID/:productID", returnProductFromSale)
router.put("/:id", updateSales);
router.get("/query", querySales);
router.get("/sort", salesSort);
router.get("/:id", getSalesById);
// router.delete("/:id", deleteSales);
// router.delete("/details/:id", deleteSalesDetail);

module.exports = router;
