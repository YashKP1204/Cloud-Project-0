const ShopRequest = require('../models/ShopRequest');
const Shop = require("../models/Shop");
const User = require('../models/User');

// GET /api/shop/admin/requests - get all pending shop requests
const getAllShopRequests = async (req, res) => {
  try {
    const requests = await ShopRequest.find().populate('user', 'name email role');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch shop requests' });
  }
};

// PUT /api/shop/admin/approve/:id - approve a request
const approveShopRequest = async (req, res) => {
  try {
    const request = await ShopRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
     if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    request.status = 'approved';
    request.reviewedAt = new Date();
    await request.save();

    
    const shop = new Shop({
      user: request.user,
      shopName:request.shopName,
      gstNumber: request.gstNumber,
      shopType: request.shopType,
      address: request.address,
      pinCode: request.pinCode,
      state: request.state
    });
    const newShop = await shop.save();
    // Update user role to 'seller'

    await User.findByIdAndUpdate(request.user, { role: 'seller', shop: newShop._id }, { runValidators: true , new: true });

    res.json({ message: 'Shop request approved successfully',shop });
  } catch (err) {
    res.status(500).json({ message: 'Approval failed' });
  }
};

// PUT /api/shop/admin/reject/:id - reject a request
const rejectShopRequest = async (req, res) => {
  const { reason } = req.body;

  try {
    const request = await ShopRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    request.reviewedAt = new Date();
    request.rejectionReason = reason || 'No reason provided';
    await request.save();

    res.json({ message: 'Shop request rejected' });
  } catch (err) {
    res.status(500).json({ message: 'Rejection failed' });
  }
};

module.exports = {
  getAllShopRequests,
  approveShopRequest,
  rejectShopRequest,
};
