const express = require('express')
const router = express.Router()
const{createSales,getAllSales,updateSales,deleteSales, querySales} = require ("../controllers/salesController")

router.post("/", createSales)
router.get("/list",getAllSales)
router.put("/:id",updateSales)
router.get("/query",querySales)
router.delete("/:id",deleteSales)


module.exports = router