const express = require("express");
const router = express.Router();
const {createStock} = require("../controllers/stockController")

router.post("/",createStock)


module.exports = router