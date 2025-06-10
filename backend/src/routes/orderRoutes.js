const express = require('express');
const router = express.Router({mergeParams:true});
const { placeOrder,
     getUserOrders , 
     getSellerShopOrders ,
      updateSellerOrderStatus,
      adminGetAllOrders,
      getAdminPendingOrders,
      getOrdersWithAtLeastOneItemArrived,
      adminUpdateOrderStatus,
      adminGetOrdersGroupedByShop,
      adminPlaceOrderToShop ,
      adminGetFullyArrivedOrders,
      adminMarkOrderAsArrivedWhenAllItemsReady
    } = require('../controllers/orderController');
const { protect , authorizeRoles} = require('../middleware/authMiddleware');

// POST /orders - Place a new order
router.post('/place',protect,authorizeRoles('user','seller'),placeOrder);
// admin create order to shop 
router.post('/admin/place-to-shop', protect, authorizeRoles('admin'), adminPlaceOrderToShop);
// seller update order status
router.put('/seller/:orderId/update-status',protect,authorizeRoles('seller'),updateSellerOrderStatus)
// admin controller routes
router.put('/admin/:orderId/update-status',protect,authorizeRoles('admin'),adminUpdateOrderStatus);
// admin mark order as arrived when all items are ready
router.put('/admin/:orderId/mark-as-arrived',protect,authorizeRoles('admin'),adminMarkOrderAsArrivedWhenAllItemsReady);
// seller get orders
router.get('/seller/',protect,authorizeRoles('seller'),getSellerShopOrders);
router.get('/admin/',protect,authorizeRoles('admin'),adminGetAllOrders);
router.get('/admin/pending-orders',protect,authorizeRoles('admin'),getAdminPendingOrders);
router.get('/admin/some-inventory-arrived',protect,authorizeRoles('admin'),getOrdersWithAtLeastOneItemArrived);
router.get('/admin/grouped-by-shop',protect,authorizeRoles('admin'),adminGetOrdersGroupedByShop);
router.get('/admin/ready-to-delivery/',protect,authorizeRoles('admin'),adminGetFullyArrivedOrders);

// GET /orders - Get user's order history
router.get('/', protect,authorizeRoles('user','seller'), getUserOrders);

module.exports = router;
