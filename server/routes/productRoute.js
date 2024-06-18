const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define routes
router.post('/', productController.createProduct);
router.get('/', productController.getAllProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/search', productController.searchProduct);
router.get('/pagination-list', productController.paginationProduct);
router.get('/sorting-data', productController.sortingProduct);
router.get('/:id', productController.getProduct);

module.exports = router;
