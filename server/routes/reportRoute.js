const express = require("express");
const router = express.Router();
const {
  createReport,
  updateReport,
  deleteReport,
  queryReport,
  getAllReport,
} = require("../controllers/reportController");

router.post("/", createReport);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);
router.get("/query", queryReport);
router.get("/list", getAllReport);

module.exports = router;
