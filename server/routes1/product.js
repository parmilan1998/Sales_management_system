const express = require('express')
const router = express.Router()
const productController = require('../Controllers/productController')

router.post('/', productController.createProduct)
router.get('/search', productController.searchProduct);
router.get('/', productController.getAllProduct)
router.put('/:id', productController.updateProduct)
router.delete('/:id', productController.deleteProduct)
router.get('/:id', productController.getProduct)

module.exports = router