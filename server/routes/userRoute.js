const express = require("express");

const {
  //   registerUser,
  logOutUser,
  loginUser,
  getUserDetails,
} = require("../controllers/userController");

const router = express.Router();

// router.post("/register", registerUser);
router.post("/logout", logOutUser);
router.post("/login", loginUser);
router.get("/", getUserDetails);

module.exports = router;
