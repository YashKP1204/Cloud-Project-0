const express = require('express');
const router = express.Router({mergeParams:true});
const upload = require('../middleware/uploadMiddleware');

const {
  createProduct,
  updateProduct,
  getShopProducts,
  safeDeleteProduct,
  getAllProducts,
  getProductById
} = require('../controllers/productController');
const { protect , authorizeRoles } = require('../middleware/authMiddleware');
router.post('/products/create', protect,authorizeRoles('seller'), upload.array('images', 5), createProduct);
router.put('/products/update/:id', protect,authorizeRoles('seller'),upload.array('images', 5), updateProduct);
router.delete('/products/:id', protect, authorizeRoles('seller','admin'),safeDeleteProduct);
router.get('/products/', protect, authorizeRoles('seller'), getShopProducts);
router.get('/products/:id', protect, authorizeRoles('seller'), getProductById); // Assuming you want to get products by seller ID
router.get('/all', protect, authorizeRoles('admin','user'), getAllProducts); // Assuming you want to get all products for admin
router.get('/:id', protect,getProductById); // Assuming you want to get product by ID for all users

module.exports = router;
