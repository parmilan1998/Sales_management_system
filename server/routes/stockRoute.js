const express = require('express')
const router = express.Router()

const stockController = require('../controllers/stockController')


router.get("/list", stockController.getAllStock)
router.search("/search", stockController.searchStock)
router.put("/:id", stockController.updateStock)
router.delete("/:id", stockController.deleteStock)

module.exports = router

