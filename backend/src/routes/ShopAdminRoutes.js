const express = require('express');
const router = express.Router({mergeParams:true});
const {
  getAllShopRequests,
  approveShopRequest,
  rejectShopRequest
} = require('../controllers/shopAdminController');


const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Admin-only routes
router.get('/shop/requests', protect,authorizeRoles("admin"), getAllShopRequests);
router.put('/shop/approve/:id', protect,authorizeRoles("admin"), approveShopRequest);
router.put('/shop/reject/:id', protect,authorizeRoles("admin"), rejectShopRequest);

module.exports = router;
