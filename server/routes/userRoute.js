const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  registerUser,
  logOutUser,
  loginUser,
  getUserDetails,
  updateUserProfile,
  changePassword,
} = require("../controllers/userController");

const uploadPath = path.resolve(__dirname, "../public/profile");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName =
      file.fieldname + "_" + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const maxSize = 5 * 1000 * 1000;
const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
});

let uploadHandler = upload.single("profileImage");

const handleFileUpload = (req, res, next) => {
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Maximum file size is 5MB" });
      }
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    next();
  });
};

router.post("/register", handleFileUpload, registerUser);
router.post("/logout", logOutUser);
router.post("/login", loginUser);
router.get("/", getUserDetails);
router.put("/", handleFileUpload, updateUserProfile);
router.put("/change-password", changePassword);

module.exports = router;
