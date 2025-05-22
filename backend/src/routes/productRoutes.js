const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');

const {
  createProduct,
  updateProduct,
  getMyProducts,
  deleteProduct,
  getAllProducts,
  getProductById
} = require('../controllers/productController');
const { protect , authorizeRoles } = require('../middleware/authMiddleware');
router.post('/create', protect,authorizeRoles('seller'), upload.array('images', 5), createProduct);
router.get('/all', protect, authorizeRoles('admin'||'customer'), getAllProducts); // Assuming you want to get all products for admin
router.get('/seller/product', protect, authorizeRoles('seller'), getMyProducts);
router.get('/:id', protect,getProductById); // Assuming you want to get product by ID for all users
router.put('/update/:id', protect,authorizeRoles('seller'),upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorizeRoles('seller'||'admin'), deleteProduct);

module.exports = router;
