import express from "express";
const router = express.Router()
import{
createProduct,
searchProduct,
getAllProduct,
updateProduct,
deleteProduct,
getProduct
} from '../controllers/productController.js'

router.post('/', createProduct)
router.get('/search', searchProduct);
router.get('/', getAllProduct)
router.put('/:id', updateProduct)
router.delete('/:id', deleteProduct)
router.get('/:id', getProduct)

export default router;