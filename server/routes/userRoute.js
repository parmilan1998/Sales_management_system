const express = require("express");

const router = express.Router();

router.post("/", registerUser);
router.post("/", logOutUser);
router.get("/", getUserDetails);

module.exports = router;
