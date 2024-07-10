const express = require("express");
const {
  createPurchase,
  deletePurchase,
  updatePurchase,
  queryPurchase,
  getAllPurchases,
  getPurchaseById,
} = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", createPurchase);
router.get("/list", getAllPurchases);
router.get("/query", queryPurchase);
router.get("/:id", getPurchaseById);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

module.exports = router;
