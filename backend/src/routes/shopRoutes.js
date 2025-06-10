const express = require('express');
const router = express.Router({mergeParams:true});
const {getSellerDashboardData} = require('../controllers/shopController');
const { protect, authorizeRoles,authorizeSeller } = require('../middleware/authMiddleware');
router.get("/dashboard",protect,authorizeRoles('seller'),authorizeSeller,getSellerDashboardData);
module.exports = router;