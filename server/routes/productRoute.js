const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  queryProducts,
} = require("../controllers/productController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(__dirname, "../public/products");
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
    if (!req.file) {
      return res.status(400).json({ message: "No file!" });
    }
    next();
  });
};

router.post("/", handleFileUpload, createProduct);
router.get("/query", queryProducts);
router.get("/list", getAllProduct);
router.put("/:id", handleFileUpload, updateProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProduct);

module.exports = router;
