const express = require("express");
const {
  createUnitType,
  getAllUitTypes,
} = require("../controllers/unitController");

const router = express.Router();

router.post("/", createUnitType);
router.get("/list", getAllUitTypes);

module.exports = router;
