const express = require("express");

const {
  // registerUser,
  logOutUser,
  loginUser,
  getUserDetails,
  updateUserProfile,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

// router.post("/register", registerUser);
router.post("/logout", logOutUser);
router.post("/login", loginUser);
router.get("/", getUserDetails);
router.put("/", updateUserProfile);
router.put("/change-password", changePassword);

module.exports = router;
