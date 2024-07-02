const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createCategory,
  queryCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
} = require("../controllers/categoryController");

const router = express.Router();

const uploadPath = path.resolve(__dirname, "../public/category");

// Ensure the directory exists
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

let uploadHandler = upload.single("image");

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

router.post("/", handleFileUpload, createCategory);
router.get("/query", queryCategory);
router.get("/list", getCategories);
router.put("/:id", handleFileUpload, updateCategory);
router.delete("/:id", deleteCategory);
router.get("/:id", getCategory);

module.exports = router;
