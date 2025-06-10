const express = require('express');
const { addToCart, getCart , updateCartItem, removeCartItem , clearCart } = require('../controllers/cartController');
const { protect ,authorizeRoles} = require('../middleware/authMiddleware');
const router = express.Router({mergeParams:true});

router.post('/add', protect, addToCart);
router.get('/', protect, getCart);
router.put('/update', protect, updateCartItem);
router.put('/remove', protect, removeCartItem);
router.put('/clear', protect, clearCart);


module.exports = router;
