const express = require('express');
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    categoryPagination,
    searchCategory
} = require('../controllers/categoryController');

const router = express.Router();

router.post('/', createCategory);
router.get('/list', getCategories);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);
router.get('/paginated-list', categoryPagination);
router.get('/search', searchCategory);

module.exports = router;
