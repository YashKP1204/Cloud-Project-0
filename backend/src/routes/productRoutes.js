const express = require('express');
const router = express.Router({mergeParams:true});
const upload = require('../middleware/uploadMiddleware');

const {
  createProduct,
  updateProduct,
  getShopProducts,
  deleteProduct,
  getAllProducts,
  getProductById
} = require('../controllers/productController');
const { protect , authorizeRoles } = require('../middleware/authMiddleware');
router.post('/create', protect,authorizeRoles('seller'), upload.array('images', 5), createProduct);
router.put('/update/:id', protect,authorizeRoles('seller'),upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorizeRoles('seller','admin'), deleteProduct);
router.get('/all', protect, authorizeRoles('admin','user'), getAllProducts); // Assuming you want to get all products for admin
router.get('/seller/', protect, authorizeRoles('seller'), getShopProducts);
router.get('/:id', protect,getProductById); // Assuming you want to get product by ID for all users

module.exports = router;
