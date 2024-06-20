const express = require("express")
const router = express.Router()
const {createReport,updateReport} = require("../controllers/reportController")

router.post("/", createReport)
router.post("/:id", updateReport)

module.exports= router