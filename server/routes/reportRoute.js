const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const {
  createReport,
  updateReport,
  deleteReport,
  queryReport,
  getAllReport,
  getReport,
} = require("../controllers/reportController");

const uploadPath = path.resolve(__dirname, "../public/reports");

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

const maxSize = 10 * 1000 * 1000; // 10 MB limit
const upload = multer({
  storage: storage,
  limits: {
    fileSize: maxSize,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

let uploadHandler = upload.single("pdf");

const handleFileUpload = (req, res, next) => {
  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ message: "Maximum file size is 10MB" });
      }
      return res.status(400).json({ message: "File upload error" });
    } else if (err) {
      return res.status(500).json({ message: err.message });
    }

    next();
  });
};

router.post("/", handleFileUpload, createReport);
router.put("/:id", handleFileUpload, updateReport);
router.delete("/:id", deleteReport);
router.get("/query", queryReport);
router.get("/list", getAllReport);
router.get("/download/:id", getReport);

module.exports = router;
