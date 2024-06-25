const express = require("express")
const router = express.Router()
const {createReport,updateReport} = require("../controllers/reportController")

router.post("/", createReport)
router.put("/:id", updateReport)

module.exports= router