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
        cb(null, "./images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
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

router.post("/", (req, res) => {
    uploadHandler(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            if ((err.code = "LIMIT_FILE_SIZE")) {
                res.status(400).json({message: "Maximum file size is 5MB"});
            }
            return res.status(400).json({message: "File upload error"});
        } else if (err) {
            return res.status(500).json({message: "Internal server error"});
        }
        if (!req.file) {
            res.status(400).json({message: "No file!"});
        }

        createProduct(req, res);
    });
});

router.put("/:id", (req, res) => {
    uploadHandler(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            console.log(req.file);
            if ((err.code = "LIMIT_FILE_SIZE")) {
                res.status(400).json({message: "Maximum file size is 5MB"});
            }
            return res.status(400).json({message: "File upload error"});
        } else if (err) {
            return res.status(500).json({message: "Internal server error"});
        }
        if (!req.file) {
            res.status(400).json({message: "No file!"});
        }

        updateProduct(req, res);
    });
});

router.get("/query", queryProducts);
router.get("/list", getAllProduct);
router.delete("/:id", deleteProduct);
router.get("/:id", getProduct);

module.exports = router;
