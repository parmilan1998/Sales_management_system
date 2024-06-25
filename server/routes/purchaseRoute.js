const express = require("express");
const purchaseController = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", purchaseController.createPurchase);
router.get("/list", purchaseController.getAllPurchases);
router.get("/query", purchaseController.queryPurchase);
router.put("/:id", purchaseController.updatePurchase);
router.delete("/:id", purchaseController.deletePurchase);

module.exports = router;
