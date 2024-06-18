const express = require("express");
const purchaseController = require("../controllers/purchaseController");

const router = express.Router();

router.post("/", purchaseController.createPurchase);
router.get("/", purchaseController.getAllPurchases);
router.get("/search", purchaseController.searchPurchases);
router.get("/pagination", purchaseController.paginationPurchases);
router.get("/sort", purchaseController.sortingPurchases);
router.put("/:id", purchaseController.updatePurchase);
router.delete("/:id", purchaseController.deletePurchase);

module.exports = router;
