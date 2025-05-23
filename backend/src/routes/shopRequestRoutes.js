const express = require('express');
const router = express.Router();
const { submitShopRequest, getMyShopRequest, deleteMyShopRequest } = require('../controllers/shopRequestController');
const { protect } = require('../middleware/authMiddleware'); // JWT middleware

// Only authenticated users can submit
router.get('/request/get', protect, getMyShopRequest);
router.delete('/request/delete', protect, deleteMyShopRequest);
router.post('/request', protect, submitShopRequest);

module.exports = router;
