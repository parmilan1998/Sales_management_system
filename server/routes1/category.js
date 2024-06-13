const express = require('express')
const router = express.Router();
const categoryController = require('../Controllers/categoryController')

router.post('/', categoryController.createCategory)
router.get('/', categoryController.getCategory)
router.put('/:id', categoryController.updateCategory)
router.delete('/:id', categoryController.deleteCategory)
router.get('/search', categoryController.searchCategory);



module.exports = router