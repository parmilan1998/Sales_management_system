const express = require("express");
const {
  createPurchase,
  deletePurchase,
  updatePurchase,
  queryPurchase,
  getAllPurchases,
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", createPurchase);
router.get("/list", getAllPurchases);
router.get("/query", queryPurchase);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

module.exports = router;
